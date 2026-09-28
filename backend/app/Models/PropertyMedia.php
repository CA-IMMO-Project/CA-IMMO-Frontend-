<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyMedia extends Model
{
    protected $fillable = [
        'property_id',
        'type',
        'path',
        'original_name',
        'sort_order',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
