import re
import os
from django.shortcuts import redirect
from django.contrib.auth.models import User
from .models import Profile, Test, LeagueMember, League
from rest_framework import generics
from .serializers import UserSerializer, TestSerializer, ProfileSerializer, LeagueMemberSerializer, LeagueSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from urllib.parse import urlparse


User = get_user_model()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
parsed_url = urlparse(FRONTEND_URL)
domain = parsed_url.hostname
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        print(user)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class SetUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user  # Authenticated user
            data = request.data
            username = data.get('username')


            # Validate username
            if not username:
                return Response({'success': False, 'error': 'Username cannot be blank.'}, status=status.HTTP_400_BAD_REQUEST)

            if not re.match(r'^[a-zA-Z0-9_-]+$', username):
                return Response({'success': False, 'error': 'Username can only contain numbers, characters, "_" and "-"'}, status=status.HTTP_400_BAD_REQUEST)

            # Check for duplicate username
            if Profile.objects.filter(username=username).exists():
                return Response({'success': False, 'error': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)

            profile, created = Profile.objects.get_or_create(user=user)

            profile.username = username
            profile.save()

            return Response({'success': True, 'message': 'Username updated successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateTestView(generics.CreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

class TestListView(generics.ListAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Test.objects.filter(profile=self.request.user.profile)


@login_required
def google_login_callback(request):
    user = request.user
    # If the user has a username, proceed with generating tokens
    social_accounts = SocialAccount.objects.filter(user=user, provider='google')
    social_account = social_accounts.first()

    if not social_account:
        return redirect(f'{FRONTEND_URL}/#/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account).first()
    refresh = RefreshToken.for_user(user)
    print(f"Generated tokens for user {user.id}:")
    print(f"Access: {str(refresh.access_token)}")
    print(f"Refresh: {str(refresh)}")
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    print(domain)
    if token:
        if not hasattr(user, 'profile'): # Ensure the user has a profile
            Profile.objects.create(user=user)
            response = redirect(f'{FRONTEND_URL}/#/set-username')
            response.set_cookie(
                key='access_token',
                value=access_token,
                secure=True,
                samesite='None',
                httponly=False,
                domain=".typingclub.tech",
            )
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                secure=True,
                samesite='None',
                httponly=False,
                domain=".typingclub.tech",
            )
            return response        
    # else 
        # Create response with cookies
        response = redirect(f'{FRONTEND_URL}/#/login/callback')
        response.set_cookie(
            key='access_token',
            value=access_token,
            secure=True,
            samesite='None',
            httponly=False,
            domain=".typingclub.tech",
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            secure=True,
            samesite='None',
            httponly=False,
            domain=".typingclub.tech",
        )
        return response
    else:
        return redirect(f'{FRONTEND_URL}/#/login/callback/?error=NoGoogleToken')

@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)


class LeagueCreateJoinView(APIView):
    
    # Get user's leagues
    def get(self, request):
        # Get leagues where user is a member
        memberships = LeagueMember.objects.filter(profile=request.user.profile)
        leagues = League.objects.filter(members__in=memberships)
        serializer = LeagueSerializer(leagues, many=True)
        return Response(serializer.data)
    
    # Create League
    def post(self, request):
        profile = request.user.profile
        serializer = LeagueSerializer(data=request.data)
        if serializer.is_valid():
            league = serializer.save(creator=profile)
            LeagueMember.objects.create(league=league, profile=profile)
            return Response({'code': league.code}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Join League
    def put(self, request):
        code = request.data.get('code', '').upper()
        try:
            league = League.objects.get(code=code)
            profile = request.user.profile
            
            if LeagueMember.objects.filter(league=league, profile=profile).exists():
                return Response({'error': 'Already a member'}, status=status.HTTP_400_BAD_REQUEST)
                
            LeagueMember.objects.create(league=league, profile=profile)
            return Response({'status': 'joined'}, status=status.HTTP_200_OK)
            
        except League.DoesNotExist:
            return Response({'error': 'Invalid league code'}, status=status.HTTP_404_NOT_FOUND)

class LeagueRankingView(APIView):
    def get(self, request, league_id):
        try:
            league = League.objects.get(id=league_id)
            members = league.members.all().order_by('-profile__max_wpm_15')[:15]
            serializer = LeagueMemberSerializer(members, many=True)
            return Response(serializer.data)
        except League.DoesNotExist:
            return Response({'error': 'League not found'}, status=status.HTTP_404_NOT_FOUND)
        
class Ranking15View(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        profiles = Profile.objects.all().order_by('-max_wpm_15')[:15]
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

class Ranking30View(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        profiles = Profile.objects.all().order_by('-max_wpm_30')[:15]
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)