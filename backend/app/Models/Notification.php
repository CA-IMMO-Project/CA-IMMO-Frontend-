<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'text',
        'unread',
    ];

    protected $casts = [
        'unread' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
