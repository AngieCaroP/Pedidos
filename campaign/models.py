from django.db import models

class Guia(models.Model):
    fecha = models.DateField()
    plataforma = models.CharField(max_length=10)
    texto = models.TextField()

    def __str__(self):
        return f"{self.fecha} - {self.plataforma} - {self.texto[:30]}"
