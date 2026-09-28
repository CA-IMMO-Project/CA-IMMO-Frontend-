<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitRequest extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'request_number',
        'visit_date',
        'visit_time',
        'full_name',
        'phone',
        'comment',
        'status',
        'advisor_id',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function advisor()
    {
        return $this->belongsTo(User::class, 'advisor_id');
    }
}
