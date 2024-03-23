# gpt2_service.py
from transformers import GPT2LMHeadModel, GPT2Tokenizer

class GPT2Service:
    def __init__(self):
        self.tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self.model = GPT2LMHeadModel.from_pretrained("gpt2")

    def generate_scene_descriptions(self, prompt, num_descriptions=5):
        inputs = self.tokenizer.encode(prompt, return_tensors="pt", max_length=1024, truncation=True)
        outputs = self.model.generate(inputs, max_length=150, num_return_sequences=num_descriptions, no_repeat_ngram_size=2, top_k=50, top_p=0.95)

        descriptions = [self.tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
        return descriptions
