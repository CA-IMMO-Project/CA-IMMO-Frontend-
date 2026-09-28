<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseRequest extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'request_number',
        'first_name',
        'last_name',
        'phone',
        'email',
        'birth_date',
        'profession',
        'country',
        'has_bank_account',
        'payment_method',
        'duration',
        'initial_payment',
        'message',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'has_bank_account' => 'boolean',
        'initial_payment' => 'decimal:2',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
