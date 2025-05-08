from django.shortcuts import render, redirect
from .models import Guia
from .forms import GuiaForm

def index(request):
    form = GuiaForm()
    if request.method == 'POST':
        form = GuiaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('guias')
    return render(request, 'index.html', {'form': form})

def guias(request):
    guias = Guia.objects.all().order_by('-fecha')
    return render(request, 'guias.html', {'guias': guias})
