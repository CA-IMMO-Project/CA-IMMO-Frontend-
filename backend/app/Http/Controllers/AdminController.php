<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyDocument;
use App\Models\PurchaseRequest;
use App\Models\SearchRequest;
use App\Models\Transaction;
use App\Models\User;
use App\Models\VisitRequest;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'properties' => [
                'available' => Property::where('status', 'published')->count(),
                'verification' => Property::where(
                    'status',
                    'pending_verification'
                )->count(),
                'reserved' => Property::where(
                    'status',
                    'reserved'
                )->count(),
                'sold' => Property::where(
                    'status',
                    'sold'
                )->count(),
            ],

            'requests' => [
                'purchases' => PurchaseRequest::count(),
                'searches' => SearchRequest::count(),
            ],

            'visits' => VisitRequest::count(),
            'users' => User::count(),
            'transactions' => Transaction::count(),

            'documents_pending' => PropertyDocument::where(
                'status',
                'pending'
            )->count(),
        ]);
    }

    public function properties()
    {
        return response()->json(
            Property::with([
                'owner',
                'media',
                'documents'
            ])->latest()->paginate(20)
        );
    }

    public function updatePropertyStatus(
        Request $request,
        Property $property
    ) {
        $data = $request->validate([
            'status' => 'required|in:
                draft,
                pending_verification,
                published,
                reserved,
                sold,
                rejected,
                disabled',
        ]);

        $property->status = $data['status'];

        if ($data['status'] === 'published') {
            $property->verified = true;
            $property->available = true;
            $property->published_at = now();
        }

        if ($data['status'] === 'sold') {
            $property->available = false;
        }

        if ($data['status'] === 'disabled') {
            $property->available = false;
        }

        $property->save();

        return response()->json([
            'message' => 'Statut du terrain mis à jour.',
            'property' => $property,
        ]);
    }

    public function documents()
    {
        return response()->json(
            PropertyDocument::with('property.owner')
                ->latest()
                ->paginate(20)
        );
    }

    public function updateDocument(
        Request $request,
        PropertyDocument $document
    ) {
        $data = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_comment' => 'nullable|string',
        ]);

        $document->update($data);

        return response()->json($document);
    }

    public function purchases()
    {
        return response()->json(
            PurchaseRequest::with([
                'property',
                'user'
            ])->latest()->paginate(20)
        );
    }

    public function searches()
    {
        return response()->json(
            SearchRequest::with('user')
                ->latest()
                ->paginate(20)
        );
    }

    public function visits()
    {
        return response()->json(
            VisitRequest::with([
                'property',
                'user',
                'advisor'
            ])->latest()->paginate(20)
        );
    }

    public function users()
    {
        return response()->json(
            User::latest()->paginate(20)
        );
    }

    public function transactions()
    {
        return response()->json(
            Transaction::with([
                'property',
                'buyer',
                'seller'
            ])->latest()->paginate(20)
        );
    }
}
