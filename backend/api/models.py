from django.db import models
from django.contrib.auth.models import User
import uuid



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    max_wpm_15 = models.FloatField(default=0)
    max_wpm_30 = models.FloatField(default=0)
    joined_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        if self.username:
            return self.username
        return 'no-name'
    
class Test(models.Model):
    DURATION_CHOICES = [
        (15, "15 seconds"),
        (30, "30 seconds"),
    ]

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="tests")
    duration = models.IntegerField(choices=DURATION_CHOICES)
    score = models.FloatField() 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.username} - {self.duration}s Test - Score: {self.score}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        if self.duration == 15 and self.score > self.profile.max_wpm_15:
            self.profile.max_wpm_15 = self.score
            self.profile.save()
        elif self.duration == 30 and self.score > self.profile.max_wpm_30:
            self.profile.max_wpm_30 = self.score
            self.profile.save()

def generate_unique_code():
    while True:
        code = uuid.uuid4().hex[:6].upper()
        if not League.objects.filter(code=code).exists():
            return code
        

class League(models.Model):
    code = models.CharField(max_length=8, unique=True, default=generate_unique_code)
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='created_leagues')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class LeagueMember(models.Model):
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='members')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('league', 'profile')
        

