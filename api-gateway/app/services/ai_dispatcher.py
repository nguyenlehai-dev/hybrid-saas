"""
AI Dispatcher Service - Communicates with VM2 Docker AI Engine.
Handles dispatching tasks, checking status, and health checks.
"""

import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class AIDispatcher:
    """Service to communicate with VM2 AI Engine via HTTP."""

    def __init__(self):
        self.base_url = settings.AI_ENGINE_URL
        self.timeout = settings.AI_ENGINE_TIMEOUT
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=httpx.Timeout(self.timeout, connect=10.0),
        )

    async def health_check(self) -> bool:
        """Check if VM2 AI Engine is available."""
        try:
            response = await self.client.get("/health")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"AI Engine health check failed: {e}")
            return False

    async def dispatch(self, task) -> dict:
        """
        Dispatch an AI task to VM2 for processing.
        Maps task types to appropriate VM2 API endpoints.
        """
        endpoint_map = {
            "text_to_image": "/sdapi/v1/txt2img",
            "image_to_image": "/sdapi/v1/img2img",
            "inpaint": "/sdapi/v1/img2img",  # with inpainting mask
            "upscale": "/sdapi/v1/extra-single-image",
            "review_product": "/sdapi/v1/txt2img",  # with product LoRA
            "multishots": "/sdapi/v1/txt2img",      # batch with different seeds
            "skin_enhancer": "/sdapi/v1/img2img",    # with skin LoRA + ControlNet
            "crop": "/api/crop",                      # custom endpoint
            "video_generate": "/api/video",           # future endpoint
        }

        endpoint = endpoint_map.get(task.task_type)
        if not endpoint:
            raise ValueError(f"Unknown task type: {task.task_type}")

        # Build the request payload based on task type
        payload = self._build_payload(task)

        try:
            logger.info(f"Dispatching task {task.id} ({task.task_type}) to {endpoint}")

            response = await self.client.post(
                endpoint,
                json=payload,
                timeout=httpx.Timeout(self.timeout),
            )

            if response.status_code != 200:
                error_detail = response.text[:500]
                raise Exception(f"AI Engine returned {response.status_code}: {error_detail}")

            result = response.json()
            logger.info(f"Task {task.id} dispatched successfully")
            return result

        except httpx.ConnectError:
            raise Exception("Cannot connect to AI Engine (VM2). Check if it's running.")
        except httpx.TimeoutException:
            raise Exception(f"AI Engine timed out after {self.timeout}s")
        except Exception as e:
            logger.error(f"Failed to dispatch task {task.id}: {e}")
            raise

    async def check_status(self, task_id: str) -> dict | None:
        """
        Check the status of a task on VM2.
        Returns updated status info or None if not available.
        """
        try:
            response = await self.client.get(
                f"/api/task-status/{task_id}",
                timeout=httpx.Timeout(10.0),
            )
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            logger.warning(f"Failed to check task status {task_id}: {e}")
            return None

    def _build_payload(self, task) -> dict:
        """Build the API payload based on task type and input parameters."""
        params = task.input_params or {}
        base_payload = {
            "prompt": params.get("prompt") or "",
            "negative_prompt": params.get("negative_prompt") or "",
            "width": params.get("width", 512),
            "height": params.get("height", 512),
            "steps": params.get("steps", 30),
            "cfg_scale": params.get("cfg_scale", 7.0),
            "seed": params.get("seed", -1),
            "sampler_name": params.get("sampler_name") or "DPM++ 2M",
            "n_iter": params.get("n_iter", 1),
            "restore_faces": bool(params.get("restore_faces", False)),
            "enable_hr": bool(params.get("enable_hr", False)),
            "hr_scale": params.get("hr_scale", 2),
            "hr_second_pass_steps": params.get("hr_second_pass_steps", 0),
            "denoising_strength": params.get("denoising_strength", 0.35),
        }

        # Apply model selection
        model = params.get("model")
        if model:
            base_payload["override_settings"] = {
                "sd_model_checkpoint": model,
            }

        # Task-specific configurations
        if task.task_type == "review_product":
            base_payload["override_settings"] = {
                "sd_model_checkpoint": params.get("model", "product_review_v1"),
            }
            if params.get("lora"):
                base_payload["prompt"] = f"<lora:{params['lora']}:0.8> {base_payload['prompt']}"

        elif task.task_type == "skin_enhancer":
            base_payload["alwayson_scripts"] = {
                "controlnet": {
                    "args": [{
                        "enabled": True,
                        "module": "openpose",
                        "model": params.get("controlnet", "control_v11p_sd15_openpose"),
                        "weight": 1.0,
                    }]
                }
            }
            if params.get("lora"):
                base_payload["prompt"] = f"<lora:{params['lora']}:0.7> {base_payload['prompt']}"

        elif task.task_type == "multishots":
            base_payload["batch_size"] = params.get("batch_size", 4)
            base_payload["seed"] = -1  # Random seeds for variety

        elif task.task_type == "upscale":
            base_payload = {
                "task_id": str(task.id),
                "resize_mode": 0,
                "upscaling_resize": params.get("scale", 2),
                "upscaler_1": "R-ESRGAN 4x+",
                "image": params.get("input_image", ""),
            }

        elif task.task_type == "inpaint":
            base_payload["mask"] = params.get("mask", "")
            base_payload["inpainting_fill"] = 1
            base_payload["inpaint_full_res"] = True

        return base_payload

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
