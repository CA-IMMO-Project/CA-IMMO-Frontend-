<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Property;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PurchaseRequestController extends Controller
{
    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',

            'firstName' => 'required|string|max:100',
            'lastName' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'email' => 'required|email',

            'birthDate' => 'nullable|date',
            'profession' => 'nullable|string|max:150',
            'country' => 'nullable|string|max:100',

            'bank' => 'nullable|string',

            'paymentMethod' => 'required|string',
            'duration' => 'nullable|string',
            'initialPayment' => 'nullable|numeric',
            'message' => 'nullable|string',
        ]);

        $number = 'ACH-' . now()->format('ymd') . '-' .
            strtoupper(Str::random(4));

        $purchase = PurchaseRequest::create([
            'user_id' => $data['user_id'] ?? null,
            'property_id' => $property->id,

            'request_number' => $number,

            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'phone' => $data['phone'],
            'email' => $data['email'],

            'birth_date' => $data['birthDate'] ?? null,
            'profession' => $data['profession'] ?? null,
            'country' => $data['country'] ?? 'Madagascar',

            'has_bank_account' =>
                ($data['bank'] ?? 'Non') === 'Oui',

            'payment_method' => $data['paymentMethod'],
            'duration' => $data['duration'] ?? null,
            'initial_payment' => $data['initialPayment'] ?? null,
            'message' => $data['message'] ?? null,

            'status' => 'pending',
        ]);

        if (!empty($data['user_id'])) {
            Notification::create([
                'user_id' => $data['user_id'],
                'type' => 'purchase',
                'title' => 'Demande d’achat reçue',
                'text' =>
                    "Votre demande {$number} est en cours de traitement.",
                'unread' => true,
            ]);
        }

        return response()->json([
            'message' => 'Demande d’achat envoyée.',
            'request_number' => $number,
            'request' => $purchase->load('property'),
        ], 201);
    }

    public function index(Request $request)
    {
        $query = PurchaseRequest::with('property');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }

    public function show(PurchaseRequest $purchaseRequest)
    {
        return response()->json(
            $purchaseRequest->load('property', 'user')
        );
    }
}
