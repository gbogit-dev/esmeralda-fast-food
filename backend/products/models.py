from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('promos', 'Promos Grupales'),
        ('desayunos', 'Desayunos'),
        ('almuerzos', 'Almuerzos'),
        ('cenas', 'Cenas'),
        ('bocaditos', 'Bocaditos'),
    ]

    BADGE_CHOICES = [
        ('HOT', 'Hot'),
        ('NEW', 'New'),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    badge = models.CharField(max_length=10, choices=BADGE_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.name


class Banner(models.Model):
    title = models.CharField(max_length=100, verbose_name="Título")
    image = models.ImageField(upload_to='banners/', verbose_name="Imagen")
    order = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Banner"
        verbose_name_plural = "Banners"

    def __str__(self):
        return self.title

