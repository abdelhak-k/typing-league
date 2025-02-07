from django.contrib import admin
from django.urls import path, include
from api.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreate.as_view(), name='user_create'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('accounts/', include('allauth.urls')),
    path('callback/', google_login_callback, name='callback'),
    path('api/auth/user/', UserView.as_view(), name='user_detail'),
    path('api/google/validate_token/', validate_google_token, name='validate_token'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/set-username/', SetUsernameView.as_view(), name='set_username'),
    path('create-test/', CreateTestView.as_view(), name='create-test'),
    path('test-results/', TestListView.as_view(), name='test-results'),
    path('api/ranking/15/', Ranking15View.as_view(), name='ranking-15'),
    path('api/ranking/30/', Ranking30View.as_view(), name='ranking-30'),
    path('api/leagues/', LeagueCreateJoinView.as_view(), name='league-create-join'),
    path('api/leagues/<int:league_id>/ranking/', LeagueRankingView.as_view(), name='league-ranking'),
]
