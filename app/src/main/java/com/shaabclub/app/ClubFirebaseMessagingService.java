package com.shaabclub.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class ClubFirebaseMessagingService extends FirebaseMessagingService {
    public static final String CHANNEL_ID = "club_updates";

    @Override
    public void onMessageReceived(RemoteMessage message) {
        String title = message.getNotification() != null
            ? message.getNotification().getTitle() : null;
        String body = message.getNotification() != null
            ? message.getNotification().getBody() : null;

        if (title == null || title.trim().isEmpty()) {
            title = message.getData().get("title");
        }
        if (body == null || body.trim().isEmpty()) {
            body = message.getData().get("body");
        }
        if (title == null || title.trim().isEmpty()) title = "نادي شعب حضرموت";
        if (body == null || body.trim().isEmpty()) body = "لديك إشعار جديد";

        String newsId = message.getData().get("newsId");
        showNotification(title, body, newsId);
    }

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        // Topic subscriptions are restored by MainActivity whenever the app opens.
    }

    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "تنبيهات نادي شعب حضرموت",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("أخبار النادي وتنبيهات المباريات");
            NotificationManager manager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private void showNotification(String title, String body, String newsId) {
        createNotificationChannel(this);
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (newsId != null && newsId.matches("\\d+")) intent.putExtra("newsId", newsId);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            (int) System.currentTimeMillis(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT |
                (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(this, CHANNEL_ID)
            : new Notification.Builder(this);

        builder.setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new Notification.BigTextStyle().bigText(body))
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(Notification.PRIORITY_HIGH);

        NotificationManager manager =
            (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify((int) (System.currentTimeMillis() & 0x7fffffff), builder.build());
        }
    }
}
