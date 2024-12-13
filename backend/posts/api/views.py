from rest_framework.viewsets import ModelViewSet
from ..models import Leader
from .serializes import apiSerializer

class ApiViewSet(ModelViewSet):
    queryset= Leader.objects.all()
    serializer_class = apiSerializer