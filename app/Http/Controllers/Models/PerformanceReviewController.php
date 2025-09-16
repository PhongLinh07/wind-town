<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\PerformanceReview;

class PerformanceReviewController extends Controller
{
    public function index()
    {
        return response()->json(PerformanceReview::with(['employee','reviewer'])->get());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'id_reviewer' => 'required|exists:employees,id_employee',
            'review_date' => 'required|date',
            'score' => 'required|integer|min:1|max:10',
            'comments' => 'nullable|string',
            'description' => 'nullable|string'
        ]);
        */
        $data = [];
        $review = PerformanceReview::create($data);
        return response()->json($review, 201);
    }

    public function show($id)
    {
        return response()->json(PerformanceReview::with(['employee','reviewer'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $review = PerformanceReview::findOrFail($id);
        $data = $request->validate([
            'review_date' => 'nullable|date',
            'score' => 'nullable|integer|min:1|max:10',
            'comments' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        $review->update($data);
        return response()->json($review);
    }

    public function destroy($id)
    {
        $review = PerformanceReview::findOrFail($id);
        $review->delete();
        return response()->json(null, 204);
    }
}
