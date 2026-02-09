<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Notification::query();

        if ($user) {
            if ($user instanceof \App\Models\User) {
                $query->where(function($q) use ($user) {
                    $q->where('user_id', $user->id)
                      ->orWhere('role', $user->role)
                      ->orWhere(function($sq) {
                          $sq->whereNull('user_id')->whereNull('penduduk_id')->whereNull('role');
                      });
                });
            } elseif ($user instanceof \App\Models\Penduduk) {
                $query->where(function($q) use ($user) {
                    $q->where('penduduk_id', $user->id)
                      ->orWhere(function($sq) {
                          $sq->whereNull('user_id')->whereNull('penduduk_id')->whereNull('role');
                      });
                });
            }
        }

        $notifications = $query->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $notifications
        ]);
    }

    public function markAsRead(Request $request)
    {
        $user = $request->user();
        $query = Notification::where('is_read', false);

        if ($user) {
            if ($user instanceof \App\Models\User) {
                $query->where(function($q) use ($user) {
                    $q->where('user_id', $user->id)->orWhere('role', $user->role);
                });
            } elseif ($user instanceof \App\Models\Penduduk) {
                $query->where('penduduk_id', $user->id);
            }
        }

        $query->update(['is_read' => true]);
        return response()->json(['message' => 'Notifikasi ditandai dibaca']);
    }

    public function markOneAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);
        return response()->json(['message' => 'Notifikasi ditandai dibaca']);
    }

    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['message' => 'Notifikasi dihapus']);
    }

    public function clearAll(Request $request)
    {
        $user = $request->user();
        $query = Notification::query();

        if ($user) {
            if ($user instanceof \App\Models\User) {
                $query->where('user_id', $user->id)->orWhere('role', $user->role);
            } elseif ($user instanceof \App\Models\Penduduk) {
                $query->where('penduduk_id', $user->id);
            }
            $query->delete();
        }

        return response()->json(['message' => 'Notifikasi dihapus']);
    }
}