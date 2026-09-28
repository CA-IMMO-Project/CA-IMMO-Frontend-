<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'birth_date',
        'profession',
        'country',
        'has_bank_account',
        'password',
        'role',
        'status',
        'identity_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'has_bank_account' => 'boolean',
            'identity_verified' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function purchaseRequests()
    {
        return $this->hasMany(PurchaseRequest::class);
    }

    public function searchRequests()
    {
        return $this->hasMany(SearchRequest::class);
    }

    public function visits()
    {
        return $this->hasMany(VisitRequest::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
