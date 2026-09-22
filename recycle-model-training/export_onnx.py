import json
from pathlib import Path

import torch
import torchvision.models as models

BASE = Path(__file__).resolve().parent
OUTPUT = BASE / "output"
MODEL_PATH = OUTPUT / "waste_recycling_resnet18.pt"
ONNX_PATH = OUTPUT / "recycle_model.onnx"

checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
classes = checkpoint["classes"]

model = models.resnet18(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, len(classes))
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

dummy = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    model,
    dummy,
    ONNX_PATH,
    input_names=["images"],
    output_names=["logits"],
    opset_version=17,
    dynamo=False,
)

with open(OUTPUT / "class_map.json", "w", encoding="utf-8") as f:
    json.dump(
        {
            "classes": classes,
            "recyclable_classes": checkpoint["recyclable_classes"],
            "non_recyclable_classes": [
                c for c in classes if c not in checkpoint["recyclable_classes"]
            ],
        },
        f,
        indent=2,
    )

print(f"Exported {ONNX_PATH}")
