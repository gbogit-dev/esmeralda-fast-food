from django.http import JsonResponse
from .models import Product, Banner

def get_products(request):
    products = Product.objects.all()
    # Format according to frontend script expectations
    # promos, desayunos, almuerzos, cenas, bocaditos
    
    data = {
        'promos': [],
        'desayunos': [],
        'almuerzos': [],
        'cenas': [],
        'bocaditos': []
    }
    
    for p in products:
        item = {
            'id': f'db_{p.id}',
            'name': p.name,
            'desc': p.description,
            'price': float(p.price) if p.price else 0.0,
            'oldPrice': float(p.old_price) if p.old_price else None,
            'img': request.build_absolute_uri(p.image.url) if p.image else '',
            'badge': p.badge
        }
        
        if p.category in data:
            data[p.category].append(item)
            
    return JsonResponse(data)

def get_banners(request):
    banners = Banner.objects.filter(is_active=True).order_by('order', '-created_at')
    data = []
    for b in banners:
        data.append({
            'id': b.id,
            'title': b.title,
            'image': request.build_absolute_uri(b.image.url) if b.image else '',
            'order': b.order
        })
    return JsonResponse(data, safe=False)

