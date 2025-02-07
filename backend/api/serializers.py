from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Test, League, LeagueMember

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['username', 'max_wpm_15', 'max_wpm_30','joined_at']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    profile_username = serializers.CharField(source='profile.username', read_only=True)
    max_wpm_15 = serializers.IntegerField(source='profile.max_wpm_15', read_only=True)
    max_wpm_30 = serializers.IntegerField(source='profile.max_wpm_30', read_only=True)
    joined_at = serializers.DateTimeField(source='profile.joined_at', read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'profile', 'profile_username', 
                 'max_wpm_15', 'max_wpm_30', 'joined_at')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.save()

        profile.username = profile_data.get('username', profile.username)
        profile.save()

        return instance

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'profile', 'duration', 'score', 'created_at')
        read_only_fields = ('profile',) 
        
class LeagueSerializer(serializers.ModelSerializer):
    creator = serializers.CharField(source='creator.username', read_only=True)
    
    class Meta:
        model = League
        fields = ['id', 'name', 'code', 'created_at', 'creator']

class LeagueMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='profile.username')
    max_wpm_15 = serializers.FloatField(source='profile.max_wpm_15')
    max_wpm_30 = serializers.FloatField(source='profile.max_wpm_30')

    class Meta:
        model = LeagueMember
        fields = ['username', 'max_wpm_15', 'max_wpm_30', 'joined_at']