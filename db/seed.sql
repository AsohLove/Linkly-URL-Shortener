
-- Clear existing data
TRUNCATE TABLE clicks RESTART IDENTITY CASCADE;
TRUNCATE TABLE links RESTART IDENTITY CASCADE;



INSERT INTO links (code, target_url, created_at, expires_at, click_count)
VALUES
('abc123', 'https://google.com', NOW() - INTERVAL '10 days', NULL, 5),

('github1', 'https://github.com', NOW() - INTERVAL '8 days', NULL, 12),

('yt2026', 'https://youtube.com', NOW() - INTERVAL '5 days', NULL, 20),

('exp001', 'https://example.com/expired', NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 day', 3),

('news99', 'https://news.ycombinator.com', NOW() - INTERVAL '2 days', NULL, 7),

('cam001', 'https://example.com/cameroon', NOW() - INTERVAL '1 day', NULL, 1);



INSERT INTO clicks (link_id, clicked_at, referrer, user_agent)
VALUES
(1, NOW() - INTERVAL '9 days', 'google.com', 'Chrome'),
(1, NOW() - INTERVAL '8 days 20 hours', 'twitter.com', 'Firefox'),
(1, NOW() - INTERVAL '7 days', 'facebook.com', 'Safari'),
(1, NOW() - INTERVAL '6 days', 'direct', 'Chrome'),
(1, NOW() - INTERVAL '5 days', 'reddit.com', 'Edge');

INSERT INTO clicks (link_id, clicked_at, referrer, user_agent)
VALUES
(2, NOW() - INTERVAL '7 days', 'google.com', 'Chrome'),
(2, NOW() - INTERVAL '6 days', 'stackoverflow.com', 'Chrome'),
(2, NOW() - INTERVAL '5 days', 'github.com', 'Firefox'),
(2, NOW() - INTERVAL '4 days', 'linkedin.com', 'Safari'),
(2, NOW() - INTERVAL '3 days', 'direct', 'Chrome'),
(2, NOW() - INTERVAL '2 days', 'google.com', 'Chrome'),
(2, NOW() - INTERVAL '1 day', 'twitter.com', 'Firefox'),
(2, NOW() - INTERVAL '12 hours', 'reddit.com', 'Edge'),
(2, NOW() - INTERVAL '6 hours', 'google.com', 'Chrome'),
(2, NOW() - INTERVAL '2 hours', 'direct', 'Chrome'),
(2, NOW() - INTERVAL '1 hour', 'github.com', 'Firefox'),
(2, NOW() - INTERVAL '30 minutes', 'stackoverflow.com', 'Chrome');

INSERT INTO clicks (link_id, clicked_at, referrer, user_agent)
VALUES
(3, NOW() - INTERVAL '4 days', 'google.com', 'Chrome'),
(3, NOW() - INTERVAL '3 days', 'youtube.com', 'Safari'),
(3, NOW() - INTERVAL '2 days', 'facebook.com', 'Firefox'),
(3, NOW() - INTERVAL '1 day', 'tiktok.com', 'Chrome'),
(3, NOW() - INTERVAL '12 hours', 'direct', 'Edge'),
(3, NOW() - INTERVAL '6 hours', 'google.com', 'Chrome'),
(3, NOW() - INTERVAL '1 hour', 'youtube.com', 'Chrome'),
(3, NOW() - INTERVAL '10 minutes', 'twitter.com', 'Firefox'),
(3, NOW() - INTERVAL '5 minutes', 'direct', 'Chrome'),
(3, NOW() - INTERVAL '1 minute', 'google.com', 'Chrome');

INSERT INTO clicks (link_id, clicked_at, referrer, user_agent)
VALUES
(4, NOW() - INTERVAL '15 days', 'google.com', 'Chrome'),
(4, NOW() - INTERVAL '14 days', 'direct', 'Firefox'),
(4, NOW() - INTERVAL '13 days', 'facebook.com', 'Safari');


INSERT INTO clicks (link_id, clicked_at, referrer, user_agent)
VALUES
(5, NOW() - INTERVAL '1 day', 'google.com', 'Chrome'),
(5, NOW() - INTERVAL '20 hours', 'twitter.com', 'Firefox'),
(5, NOW() - INTERVAL '10 hours', 'reddit.com', 'Edge'),
(5, NOW() - INTERVAL '5 hours', 'direct', 'Chrome'),
(5, NOW() - INTERVAL '2 hours', 'news.ycombinator.com', 'Chrome'),
(5, NOW() - INTERVAL '1 hour', 'google.com', 'Safari'),
(5, NOW() - INTERVAL '30 minutes', 'twitter.com', 'Chrome');


INSERT INTO clicks (link_id, clicked_at, referrer, user_agent)
VALUES
(6, NOW() - INTERVAL '20 hours', 'google.com', 'Chrome');