<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'owner_id',
        'reference',
        'title',
        'description',
        'area',
        'price',
        'price_per_sqm',
        'relief',
        'access',
        'water',
        'electricity',
        'region',
        'district',
        'commune',
        'fokontany',
        'address',
        'latitude',
        'longitude',
        'payment',
        'duration',
        'deposit',
        'custom_deposit',
        'verified',
        'available',
        'status',
        'submitted_at',
        'published_at',
    ];

    protected $casts = [
        'area' => 'decimal:2',
        'price' => 'decimal:2',
        'price_per_sqm' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'custom_deposit' => 'decimal:2',
        'verified' => 'boolean',
        'available' => 'boolean',
        'submitted_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function media()
    {
        return $this->hasMany(PropertyMedia::class);
    }

    public function documents()
    {
        return $this->hasMany(PropertyDocument::class);
    }

    public function purchaseRequests()
    {
        return $this->hasMany(PurchaseRequest::class);
    }

    public function visits()
    {
        return $this->hasMany(VisitRequest::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
