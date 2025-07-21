-- Demo chatbot bilgileri ekle
INSERT INTO public.chatbot_knowledge (question, answer, tags, active) VALUES
('Merhaba', 'Merhaba! Size nasıl yardımcı olabilirim? Sorularınızı çekinmeden sorabilirsiniz.', 'selamlama, merhaba', true),
('Sen kimsin?', 'Ben AI asistanınızım. Size yardımcı olmak için buradayım. Sorularınızı yanıtlayabilir, bilgi verebilirim.', 'tanıtım, kimlik', true),
('Nasılsın?', 'Çok iyiyim, teşekkür ederim! Size nasıl yardımcı olabilirim?', 'hal hatır, nasılsın', true),
('Neler yapabilirsin?', 'Sorularınızı yanıtlayabilirim, bilgi verebilirim, sohbet edebilirim. Hangi konuda yardıma ihtiyacınız var?', 'yetenekler, neler yapabilir', true),
('Teşekkürler', 'Rica ederim! Başka bir sorunuz varsa çekinmeden sorabilirsiniz.', 'teşekkür, minnettarlık', true),
('Hoşçakal', 'Hoşçakalın! İyi günler dilerim. Tekrar görüşmek üzere!', 'veda, güle güle', true),
('Türkçe konuşuyor musun?', 'Evet, Türkçe konuşabiliyorum. Size Türkçe olarak yardımcı olabilirim.', 'dil, türkçe', true),
('Yardım', 'Tabii ki! Size nasıl yardımcı olabilirim? Sorularınızı sorun, elimden geldiğince yardımcı olmaya çalışacağım.', 'yardım, destek', true);

-- Demo guestbook mesajları ekle
INSERT INTO public.guestbook (message) VALUES
('Bu platform gerçekten harika! AI asistan çok yardımcı oluyor.'),
('Tasarım çok güzel, kullanımı da kolay. Tebrikler!'),
('Chatbot özelliği çok başarılı. Sorularıma hemen cevap alabiliyorum.'),
('Modern ve kullanışlı bir arayüz. Çok beğendim!'),
('AI teknolojisinin gücünü burada görmek mükemmel.');