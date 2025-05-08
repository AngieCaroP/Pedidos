from django import forms
from .models import Guia

class GuiaForm(forms.ModelForm):
    class Meta:
        model = Guia
        fields = ['fecha', 'plataforma', 'texto']
