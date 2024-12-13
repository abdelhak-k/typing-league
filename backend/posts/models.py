from django.db import models

# Create your models here.

class Leader(models.Model):
    title= models.TextField(max_length=200)
    wpm= models.IntegerField()
    
    def __str__(self):
        return f"named:{self.title}, jab wpm:{120}"