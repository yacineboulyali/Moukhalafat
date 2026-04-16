-- CLEANUP EXISTING TEST DATA
DELETE FROM public.questions;
DELETE FROM public.missions;

-- FÈS
INSERT INTO public.missions (id, challenge_id, city_id, title_fr, title_ar, description_fr, mission_type, xp_reward, is_published)
VALUES 
('fes_m1', '6289ead2-79ed-4f57-9880-ec113e5a50f3', 'fes', 'L''Héritage Artisanal', 'التراث الحرفي', 'Explorez les secrets de fabrication des artisans de Fès.', 'challenge', 100, true);

INSERT INTO public.questions (mission_id, question_fr, question_ar, question_type, options, xp_reward, sort_order, is_published)
VALUES 
('fes_m1', 'Associez chaque artisanat à son quartier emblématique.', 'اربط كل حرفة بحيها الشهير.', 'matching', 
'[
  {"id": "p1", "left_fr": "Tissage", "left_ar": "النسيج", "right_fr": "Nejjarine", "right_ar": "النجارين"},
  {"id": "p2", "left_fr": "Cuir", "left_ar": "الجلد", "right_fr": "Chouara", "right_ar": "شوارة"},
  {"id": "p3", "left_fr": "Poterie", "left_ar": "الفخار", "right_fr": "Ain Nokbi", "right_ar": "عين نقبي"}
]', 30, 1, true),
('fes_m1', 'Réorganisez les étapes de la visite de la médina dans l''ordre.', 'رتب خطوات زيارة المدينة القديمة بالترتيب.', 'ranking', 
'[
  {"id": "r1", "label_fr": "Entrée par Bab Boujloud", "label_ar": "الدخول من باب بوجلود"},
  {"id": "r2", "label_fr": "Traversée du Souq Thalata", "label_ar": "عبور سوق الثلاثاء"},
  {"id": "r3", "label_fr": "Arrivée à la Mosquée Al Quaraouiyine", "label_ar": "الوصول إلى جامع القرويين"}
]', 40, 2, true);

-- MARRAKECH
INSERT INTO public.missions (id, challenge_id, city_id, title_fr, title_ar, description_fr, mission_type, xp_reward, is_published)
VALUES 
('mar_m1', 'cff063aa-0c9c-4591-9b56-2190f87ca8e2', 'marrakech', 'Le Souq des Saveurs', 'سوق النكهات', 'Découvrez les saveurs et les épices de la ville ocre.', 'challenge', 80, true);

INSERT INTO public.questions (mission_id, question_fr, question_ar, question_type, options, correct_answer, xp_reward, sort_order, is_published)
VALUES 
('mar_m1', 'Quelle est la spécialité culinaire emblématique de Marrakech ?', 'ما هو التخصص الغذائي الرمزي لمراكش؟', 'multiple_choice', 
'[
  {"id": "opt1", "label_fr": "Tanjia", "label_ar": "الطنجية"},
  {"id": "opt2", "label_fr": "Couscous", "label_ar": "الكسكس"},
  {"id": "opt3", "label_fr": "Pastilla", "label_ar": "البسطيلة"}
]', 'opt1', 25, 1, true);

-- RABAT
INSERT INTO public.missions (id, challenge_id, city_id, title_fr, title_ar, description_fr, mission_type, xp_reward, is_published)
VALUES 
('rab_m1', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'rabat', 'Leadership à l''Oudaya', 'القيادة في الأوداية', 'Apprenez les bases de la négociation administrative.', 'scenario', 120, true);

INSERT INTO public.questions (mission_id, question_fr, question_ar, question_type, options, correct_answer, score_decision, xp_reward, sort_order, is_published)
VALUES 
('rab_m1', 'La Kasbah des Oudayas est un monument…', 'قصبة الأوداية هي معلمة…', 'true_false', 
'[]', 'vrai', 10, 20, 1, true);
