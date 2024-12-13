from rest_framework.serializers import ModelSerializer
from ..models import Leader
# used to change the type to be a json file
class apiSerializer(ModelSerializer):
    class Meta:
        model = Leader
        fields = ["id","title", "wpm"]