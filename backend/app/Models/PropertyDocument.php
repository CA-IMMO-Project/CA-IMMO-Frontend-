<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyDocument extends Model
{
    protected $fillable = [
        'property_id',
        'type',
        'path',
        'original_name',
        'status',
        'admin_comment',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
