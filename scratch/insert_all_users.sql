DO 
DECLARE
  uid UUID;
BEGIN
  -- Insert session for el_ramzi_kawtar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_ramzi_kawtar', 'el_ramzi@2000', 'Kawtar El Ramzi', '2000-11-17', 'AIN ATIQ', '0693043848', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Kawtar El Ramzi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_rhazi_meriem
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_rhazi_meriem', 'el_rhazi@1990', 'Meriem El Rhazi', '1990-04-07', 'AIN ATIQ', '0772831348', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Meriem El Rhazi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for khouili_mohamed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'khouili_mohamed', 'khouili@2004', 'Mohamed Khouili', '2004-01-12', 'AIN ATIQ', '0762826737', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mohamed Khouili', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_kouri_mohamed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_kouri_mohamed', 'el_kouri@2006', 'Mohamed El Kouri', '2006-02-28', 'AIN ATIQ', '0767328443', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mohamed El Kouri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for aziz_walid
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'aziz_walid', 'aziz@2006', 'Walid Aziz', '2006-02-01', 'AIN ATIQ', '0681270057', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Walid Aziz', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essabahi_khadija
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essabahi_khadija', 'essabahi@2006', 'Khadija Essabahi', '2006-05-11', 'AIN ATIQ', '0714185033', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Khadija Essabahi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for abderradim_ouahid
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'abderradim_ouahid', 'abderradim@2005', 'Ouahid Abderradim', '2005-08-25', 'AIN ATIQ', '0720540857', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ouahid Abderradim', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for nosrat_asmae
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'nosrat_asmae', 'nosrat@2000', 'Asmae Nosrat', '2000-12-11', 'AIN ATIQ', '0615830757', '2Ã¨me AnnÃ©e du BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Asmae Nosrat', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for belhaj_kawtar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'belhaj_kawtar', 'belhaj@2005', 'Kawtar Belhaj', '2005-03-23', 'AIN ATIQ', '0702803419', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Kawtar Belhaj', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_dakhl_ayoub
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_dakhl_ayoub', 'el_dakhl@2002', 'Ayoub El Dakhl', '2002-07-31', 'AIN ATIQ', '0688467841', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ayoub El Dakhl', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for serine_nasreddine
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'serine_nasreddine', 'serine@1999', 'Nasreddine Serine', '1999-09-14', 'AIN ATIQ', '0611011733', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Nasreddine Serine', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for kasmaoui_maryam
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'kasmaoui_maryam', 'kasmaoui@2002', 'Maryam Kasmaoui', '2002-12-11', 'AIN ATIQ', '0691573456', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Maryam Kasmaoui', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_jabri_maryam
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_jabri_maryam', 'el_jabri@2004', 'Maryam El Jabri', '2004-07-22', 'AIN ATIQ', '0656748942', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Maryam El Jabri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_bakri_mohamed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_bakri_mohamed', 'el_bakri@2004', 'Mohamed El Bakri', '2004-10-08', 'AIN ATIQ', '0616795427', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mohamed El Bakri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for ait_el_mansour_salah_eddine
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'ait_el_mansour_salah_eddine', 'ait_el_mansour@2004', 'Salah Eddine Ait El Mansour', '2004-02-11', 'AIN ATIQ', '0700292986', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Salah Eddine Ait El Mansour', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for bayass_hafsa
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'bayass_hafsa', 'bayass@2001', 'Hafsa Bayass', '2001-12-22', 'AIN ATIQ', '0613341445', '2Ã¨me AnnÃ©e du BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Hafsa Bayass', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for hamissa_kawtar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'hamissa_kawtar', 'hamissa@1999', 'Kawtar Hamissa', '1999-12-05', 'AIN ATIQ', '0636886299', 'Qualification') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Kawtar Hamissa', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for idrissi_hassania
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'idrissi_hassania', 'idrissi@2001', 'Hassania Idrissi', '2001-01-29', 'AIN ATIQ', '0684151995', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Hassania Idrissi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for ajmi_khadija
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'ajmi_khadija', 'ajmi@2007', 'Khadija Ajmi', '2007-09-27', 'AIN ATIQ', '0691296832', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Khadija Ajmi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for habila_hayat
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'habila_hayat', 'habila@2004', 'Hayat Habila', '2004-01-27', 'AIN ATIQ', '0721994944', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Hayat Habila', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_habti_khaoula
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_habti_khaoula', 'el_habti@2001', 'Khaoula El Habti', '2001-06-18', 'AIN ATIQ', '0627768481', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Khaoula El Habti', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for oussaid_mohamed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'oussaid_mohamed', 'oussaid@2001', 'Mohamed Oussaid', '2001-11-30', 'AIN ATIQ', '0767512965', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mohamed Oussaid', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_khayati_ghizlane
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_khayati_ghizlane', 'el_khayati@2002', 'Ghizlane El Khayati', '2002-02-24', 'AIN ATIQ', '0770514845', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ghizlane El Khayati', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_hasnaoui_kawtar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_hasnaoui_kawtar', 'el_hasnaoui@2003', 'Kawtar El Hasnaoui', '2003-01-01', 'AIN ATIQ', '0616149492', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Kawtar El Hasnaoui', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_khettara_meryem
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_khettara_meryem', 'el_khettara@2004', 'Meryem El Khettara', '2004-04-07', 'AIN ATIQ', '0655613344', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Meryem El Khettara', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_madani_mohamed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_madani_mohamed', 'el_madani@2004', 'Mohamed El Madani', '2004-08-21', 'AIN ATIQ', '0613527263', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mohamed El Madani', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_mezouari_walid
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_mezouari_walid', 'el_mezouari@2005', 'Walid El Mezouari', '2005-02-01', 'AIN ATIQ', '0681270057', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Walid El Mezouari', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_mouden_khadija
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_mouden_khadija', 'el_mouden@2005', 'Khadija El Mouden', '2005-11-11', 'AIN ATIQ', '0714185033', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Khadija El Mouden', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_moussaoui_ouahid
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_moussaoui_ouahid', 'el_moussaoui@2006', 'Ouahid El Moussaoui', '2006-08-25', 'AIN ATIQ', '0720540857', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ouahid El Moussaoui', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_ouardi_asmae
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_ouardi_asmae', 'el_ouardi@2000', 'Asmae El Ouardi', '2000-12-11', 'AIN ATIQ', '0615830757', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Asmae El Ouardi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_yazidi_kawtar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_yazidi_kawtar', 'el_yazidi@2001', 'Kawtar El Yazidi', '2001-03-23', 'AIN ATIQ', '0702803419', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Kawtar El Yazidi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for erraji_ayoub
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'erraji_ayoub', 'erraji@2002', 'Ayoub Erraji', '2002-07-31', 'AIN ATIQ', '0688467841', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ayoub Erraji', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essadiki_nasreddine
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essadiki_nasreddine', 'essadiki@2003', 'Nasreddine Essadiki', '2003-09-14', 'AIN ATIQ', '0611011733', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Nasreddine Essadiki', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essaghir_maryam
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essaghir_maryam', 'essaghir@2004', 'Maryam Essaghir', '2004-12-11', 'AIN ATIQ', '0691573456', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Maryam Essaghir', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essalhi_maryam
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essalhi_maryam', 'essalhi@2005', 'Maryam Essalhi', '2005-07-22', 'AIN ATIQ', '0656748942', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Maryam Essalhi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essamadi_mohamed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essamadi_mohamed', 'essamadi@2006', 'Mohamed Essamadi', '2006-10-08', 'AIN ATIQ', '0616795427', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mohamed Essamadi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for ezzahraoui_salah_eddine
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'ezzahraoui_salah_eddine', 'ezzahraoui@2007', 'Salah Eddine Ezzahraoui', '2007-02-11', 'AIN ATIQ', '0700292986', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Salah Eddine Ezzahraoui', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for farah_hafsa
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'farah_hafsa', 'farah@1999', 'Hafsa Farah', '1999-12-22', 'AIN ATIQ', '0613341445', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Hafsa Farah', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for fatih_kawtar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'fatih_kawtar', 'fatih@2000', 'Kawtar Fatih', '2000-12-05', 'AIN ATIQ', '0636886299', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Kawtar Fatih', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for gharbi_hassania
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'gharbi_hassania', 'gharbi@2001', 'Hassania Gharbi', '2001-01-29', 'AIN ATIQ', '0684151995', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Hassania Gharbi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_morabit_salma
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_morabit_salma', 'el_morabit@1999', 'Salma El Morabit', '1999-05-15', 'AIN ATIQ', '0690321456', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Salma El Morabit', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_moussaoui_omar
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_moussaoui_omar', 'el_moussaoui@2002', 'Omar El Moussaoui', '2002-12-03', 'AIN ATIQ', '0765432109', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Omar El Moussaoui', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_omrani_yasmine
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_omrani_yasmine', 'el_omrani@2004', 'Yasmine El Omrani', '2004-07-28', 'AIN ATIQ', '0611223344', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Yasmine El Omrani', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for el_yamani_driss
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'el_yamani_driss', 'el_yamani@2006', 'Driss El Yamani', '2006-01-12', 'AIN ATIQ', '0788990011', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Driss El Yamani', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for errais_houda
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'errais_houda', 'errais@2005', 'Houda Errais', '2005-09-19', 'AIN ATIQ', '0677889900', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Houda Errais', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essadeq_bilal
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essadeq_bilal', 'essadeq@2003', 'Bilal Essadeq', '2003-03-30', 'AIN ATIQ', '0766554433', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Bilal Essadeq', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for essouiri_fatima_zahra
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'essouiri_fatima_zahra', 'essouiri@2000', 'Fatima-Zahra Essouiri', '2000-06-14', 'AIN ATIQ', '0654321098', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Fatima-Zahra Essouiri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for et_tahiri_khalil
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'et_tahiri_khalil', 'et_tahiri@2004', 'Khalil Et-Tahiri', '2004-11-11', 'AIN ATIQ', '0711223344', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Khalil Et-Tahiri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for ezzoubir_zineb
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'ezzoubir_zineb', 'ezzoubir@2001', 'Zineb Ezzoubir', '2001-12-25', 'AIN ATIQ', '0688776655', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Zineb Ezzoubir', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for faik_mehdi
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'faik_mehdi', 'faik@2007', 'Mehdi Faik', '2007-04-10', 'AIN ATIQ', '0700112233', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Mehdi Faik', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for faris_sara
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'faris_sara', 'faris@2002', 'Sara Faris', '2002-05-05', 'AIN ATIQ', '0611998877', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Sara Faris', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for ghanim_adam
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'ghanim_adam', 'ghanim@2004', 'Adam Ghanim', '2004-02-17', 'AIN ATIQ', '0722334455', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Adam Ghanim', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for haddad_ines
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'haddad_ines', 'haddad@2006', 'Ines Haddad', '2006-08-08', 'AIN ATIQ', '0633445566', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ines Haddad', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for hamdaou_rayan
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'hamdaou_rayan', 'hamdaou@2005', 'Rayan Hamdaou', '2005-01-22', 'AIN ATIQ', '0744556677', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Rayan Hamdaou', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for idrissi_sofia
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'idrissi_sofia', 'idrissi@2003', 'Sofia Idrissi', '2003-12-12', 'AIN ATIQ', '0655667788', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Sofia Idrissi', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for jabli_ahmed
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'jabli_ahmed', 'jabli@2001', 'Ahmed Jabli', '2001-04-04', 'AIN ATIQ', '0766778899', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Ahmed Jabli', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for kabiri_lina
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'kabiri_lina', 'kabiri@2004', 'Lina Kabiri', '2004-09-29', 'AIN ATIQ', '0677889900', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Lina Kabiri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for lahlou_marwane
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'lahlou_marwane', 'lahlou@2002', 'Marwane Lahlou', '2002-03-15', 'AIN ATIQ', '0788990011', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Marwane Lahlou', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for mansouri_aya
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'mansouri_aya', 'mansouri@2006', 'Aya Mansouri', '2006-06-30', 'AIN ATIQ', '0699001122', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Aya Mansouri', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

  -- Insert session for naji_walid
  uid := gen_random_uuid();
  INSERT INTO public.app_users (id, username, password, full_name, birth_date, site, phone, school_level) 
  VALUES (uid, 'naji_walid', 'naji@1999', 'Walid Naji', '1999-11-11', 'AIN ATIQ', '0711223344', 'BaccalaurÃ©at') 
  ON CONFLICT (username) DO NOTHING;
  INSERT INTO public.player_profiles (id, display_name, xp, level) 
  VALUES (uid, 'Walid Naji', 0, 1) 
  ON CONFLICT (display_name) DO NOTHING;

END ;
