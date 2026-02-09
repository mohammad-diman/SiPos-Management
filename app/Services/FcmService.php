<?php

namespace App\Services;

use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Laravel\Firebase\Facades\Firebase;

class FcmService
{
    /**
     * Kirim notifikasi ke token spesifik
     */
    public static function sendNotification($token, $title, $body, $data = [])
    {
        if (!$token) return false;

        $messaging = Firebase::messaging();
        
        $message = CloudMessage::withTarget('token', $token)
            ->withNotification(Notification::create($title, $body))
            ->withData($data)
            ->withAndroidConfig([
                'priority' => 'high',
                'notification' => [
                    'channel_id' => 'high_importance_channel',
                    'sound' => 'default',
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                ],
            ]);

        try {
            $messaging->send($message);
            return true;
        } catch (\Exception $e) {
            \Log::error("FCM Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Kirim ke banyak token sekaligus
     */
    public static function sendToMultiple($tokens, $title, $body, $data = [])
    {
        $tokens = array_filter($tokens); // Hapus token null
        if (empty($tokens)) return false;

        $messaging = Firebase::messaging();
        $message = CloudMessage::new()
            ->withNotification(Notification::create($title, $body))
            ->withData($data)
            ->withAndroidConfig([
                'priority' => 'high',
                'notification' => [
                    'channel_id' => 'high_importance_channel',
                    'sound' => 'default',
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                ],
            ]);

        try {
            $messaging->sendMulticast($message, $tokens);
            return true;
        } catch (\Exception $e) {
            \Log::error("FCM Multicast Error: " . $e->getMessage());
            return false;
        }
    }
}
