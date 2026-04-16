-- SEED FOR DIFFERENT EXERCISE TYPES
-- 4 missions per type: matching, ranking, multiple_choice, true_false

-- TANJA (Tangier) - SEED CITY
INSERT INTO public.missions (id, challenge_id, city_id, title_fr, title_ar, description_fr, mission_type, xp_reward, is_published, sort_order)
VALUES 
-- MATCHING MISSIONS
('tan_m1', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Artisanat du Nord', 'حرف الشمال', 'Associez les outils aux artisans.', 'challenge', 50, true, 1),
('tan_m2', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Géographie Détroit', 'جغرافيا المضيق', 'Reliez les villes à leur emplacement.', 'challenge', 50, true, 2),
('tan_m3', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Histoire de Tanger', 'تاريخ طنجة', 'Associez les dates aux événements.', 'challenge', 50, true, 3),
('tan_m4', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Langues du Détroit', 'لغات المضيق', 'Trouvez les synonymes locaux.', 'challenge', 50, true, 4),

-- RANKING MISSIONS
('tan_r1', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Le Thé à la Menthe', 'شاي بالنعناع', 'Ordonnez les étapes de préparation.', 'challenge', 60, true, 5),
('tan_r2', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Voyage de Battuta', 'رحلة ابن بطوطة', 'Classez ses destinations par ordre chronologique.', 'challenge', 60, true, 6),
('tan_r3', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Évolution du Port', 'تطور الميناء', 'Rangez les extensions du port de la plus ancienne à la plus récente.', 'challenge', 60, true, 7),
('tan_r4', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Hiérarchie Sociale', 'التسلسل الاجتماعي', 'Ordonnez les titres traditionnels.', 'challenge', 60, true, 8),

-- MULTIPLE CHOICE MISSIONS
('tan_mc1', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Le Phare du Cap Spartel', 'منارة كاب سبارتيل', 'Quel océan rencontre la Méditerranée ici ?', 'challenge', 40, true, 9),
('tan_mc2', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'La Casbah de Tanger', 'قصبة طنجة', 'Qui a construit le palais Dar el-Makhzen ?', 'challenge', 40, true, 10),
('tan_mc3', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Cuisine Tangéroise', 'المطبخ الطنجي', 'Quel est l''ingrédient principal de la Calentita ?', 'challenge', 40, true, 11),
('tan_mc4', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Les Grottes d''Hercule', 'مغارة هرقل', 'Quelle est la forme de l''ouverture sur mer ?', 'challenge', 40, true, 12),

-- TRUE/FALSE MISSIONS
('tan_tf1', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Zone Internationale', 'المنطقة الدولية', 'Tanger était-elle une zone internationale jusqu''en 1956 ?', 'challenge', 30, true, 13),
('tan_tf2', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Vent du Détroit', 'رياح المضيق', 'Le "Chergui" est un vent froid venant de l''Atlantique.', 'challenge', 30, true, 14),
('tan_tf3', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Ibn Battuta', 'ابن بطوطة', 'Ibn Battuta est né à Tanger.', 'challenge', 30, true, 15),
('tan_tf4', 'cd492ce8-f727-48a5-a2a9-c817fab2406b', 'tanja', 'Tanger Med', 'طنجة المتوسط', 'Tanger Med est le plus grand port d''Afrique.', 'challenge', 30, true, 16);

-- QUESTIONS FOR EACH MISSION
INSERT INTO public.questions (mission_id, question_fr, question_ar, question_type, options, correct_answer, xp_reward, sort_order, is_published)
VALUES 
-- Matching
('tan_m1', 'Associez les outils.', 'اربط الأدوات.', 'matching', '[{"id":"1","left_fr":"Marteau","left_ar":"مطرقة","right_fr":"Forgeron","right_ar":"حداد"},{"id":"2","left_fr":"Navette","left_ar":"مكوك","right_fr":"Tisserand","right_ar":"نساج"}]', null, 50, 1, true),
('tan_m2', 'Reliez les points.', 'اربط النقط.', 'matching', '[{"id":"1","left_fr":"Tanger","left_ar":"طنجة","right_fr":"Maroc","right_ar":"المغرب"},{"id":"2","left_fr":"Algésiras","left_ar":"الجزيرة الخضراء","right_fr":"Espagne","right_ar":"إسبانيا"}]', null, 50, 1, true),
('tan_m3', 'Dates historiques.', 'تاريخ تاريخي.', 'matching', '[{"id":"1","left_fr":"1956","left_ar":"1956","right_fr":"Indépendance","right_ar":"الاستقلال"},{"id":"2","left_fr":"1304","left_ar":"1304","right_fr":"Naissance Ibn Battuta","right_ar":"ولادة ابن بطوطة"}]', null, 50, 1, true),
('tan_m4', 'Vocabulaire.', 'مفردات.', 'matching', '[{"id":"1","left_fr":"Dar","left_ar":"دار","right_fr":"Maison","right_ar":"منزل"},{"id":"2","left_fr":"Sokhn","left_ar":"سخن","right_fr":"Chaud","right_ar":"ساخن"}]', null, 50, 1, true),

-- Ranking
('tan_r1', 'Préparation du thé.', 'تحضير الشاي.', 'ranking', '[{"id":"1","label_fr":"Ébouillanter la théière"},{"id":"2","label_fr":"Mettre le thé et le rincer"},{"id":"3","label_fr":"Ajouter le sucre et la menthe"}]', null, 60, 1, true),
('tan_r2', 'Voyages d''Ibn Battuta.', 'رحلات ابن بطوطة.', 'ranking', '[{"id":"1","label_fr":"La Mecque"},{"id":"2","label_fr":"Constantinople"},{"id":"3","label_fr":"La Chine"}]', null, 60, 1, true),
('tan_r3', 'Tanger Med.', 'طنجة المتوسط.', 'ranking', '[{"id":"1","label_fr":"Tanger Med I"},{"id":"2","label_fr":"Tanger Med II"},{"id":"3","label_fr":"Extension 2025"}]', null, 60, 1, true),
('tan_r4', 'Titres.', 'ألقاب.', 'ranking', '[{"id":"1","label_fr":"Sultan"},{"id":"2","label_fr":"Vizir"},{"id":"3","label_fr":"Caïd"}]', null, 60, 1, true),

-- Multiple Choice
('tan_mc1', 'Cap Spartel.', 'كاب سبارتيل.', 'multiple_choice', '[{"id":"a","label_fr":"Atlantique"},{"id":"b","label_fr":"Indien"},{"id":"c","label_fr":"Pacifique"}]', 'a', 40, 1, true),
('tan_mc2', 'Dar el-Makhzen.', 'دار المخزن.', 'multiple_choice', '[{"id":"a","label_fr":"Moulay Ismail"},{"id":"b","label_fr":"Hassan II"},{"id":"c","label_fr":"Mohammed V"}]', 'a', 40, 1, true),
('tan_mc3', 'Calentita.', 'كالينتيكا.', 'multiple_choice', '[{"id":"a","label_fr":"Pois chiches"},{"id":"b","label_fr":"Semoule"},{"id":"c","label_fr":"Riz"}]', 'a', 40, 1, true),
('tan_mc4', 'Grottes d''Hercule.', 'مغارة هرقل.', 'multiple_choice', '[{"id":"a","label_fr":"Espagne"},{"id":"b","label_fr":"Afrique"},{"id":"c","label_fr":"France"}]', 'b', 40, 1, true),

-- True/False
('tan_tf1', 'Zone Internationale.', 'المنطقة الدولية.', 'true_false', '[]', 'vrai', 30, 1, true),
('tan_tf2', 'Vent Chergui.', 'ريح الشرقي.', 'true_false', '[]', 'faux', 30, 1, true),
('tan_tf3', 'Origine.', 'أصل.', 'true_false', '[]', 'vrai', 30, 1, true),
('tan_tf4', 'Port.', 'ميناء.', 'true_false', '[]', 'vrai', 30, 1, true);
