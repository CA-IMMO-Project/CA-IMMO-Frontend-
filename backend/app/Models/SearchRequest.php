<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchRequest extends Model
{
    protected $fillable = [
        'user_id',
        'request_number',
        'first_name',
        'last_name',
        'phone',
        'email',
        'birth_date',
        'profession',
        'country',
        'has_bank_account',
        'zone',
        'other_zones',
        'flexible',
        'budget',
        'custom_budget',
        'area',
        'custom_area',
        'relief',
        'usage',
        'payment',
        'duration',
        'contribution',
        'info',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'has_bank_account' => 'boolean',
        'flexible' => 'boolean',
        'custom_budget' => 'decimal:2',
        'custom_area' => 'decimal:2',
        'contribution' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
