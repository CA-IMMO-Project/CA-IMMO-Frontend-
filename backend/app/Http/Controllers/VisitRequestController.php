<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Property;
use App\Models\VisitRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VisitRequestController extends Controller
{
    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',

            'visitDate' => 'required|date',
            'visitTime' => 'required',

            'fullName' => 'required|string|max:200',
            'phone' => 'required|string|max:30',

            'comment' => 'nullable|string',
        ]);

        $number = 'VIS-' .
            now()->format('ymd') .
            '-' .
            strtoupper(Str::random(4));

        $visit = VisitRequest::create([
            'user_id' => $data['user_id'] ?? null,
            'property_id' => $property->id,

            'request_number' => $number,

            'visit_date' => $data['visitDate'],
            'visit_time' => $data['visitTime'],

            'full_name' => $data['fullName'],
            'phone' => $data['phone'],

            'comment' => $data['comment'] ?? null,

            'status' => 'pending',
        ]);

        if (!empty($data['user_id'])) {
            Notification::create([
                'user_id' => $data['user_id'],
                'type' => 'visit',
                'title' => 'Demande de visite reçue',
                'text' =>
                    "Votre demande de visite {$number} a été reçue.",
                'unread' => true,
            ]);
        }

        return response()->json([
            'message' => 'Demande de visite envoyée.',
            'request_number' => $number,
            'visit' => $visit->load('property'),
        ], 201);
    }

    public function index(Request $request)
    {
        $query = VisitRequest::with('property', 'advisor');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json(
            $query->latest('visit_date')->paginate(10)
        );
    }
}
