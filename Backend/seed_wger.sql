BEGIN TRANSACTION;
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1b020b3a-3732-4c7e-92fd-a0cec90ed69b',
  '2 Handed Kettlebell Swing',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Two Handed Russian Style Kettlebell swing</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '53906cd1-61f1-4d56-ac60-e4fcc5824861',
  'Seated Hip Adduction',
  'glutes',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f24cb758-9c0d-42d4-ad9e-6025c527dd13',
  'Arnold Shoulder Press',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Very common shoulder exercise.</p>
<p> </p>
<p>As shown here: https://www.youtube.com/watch?v=vj2w851ZHRM</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f2733700-aa5d-4df7-bc52-1876ab4fb479',
  'Axe Hold',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Grab dumbbells and extend arms to side and hold as long as you can</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a6bced3c-72f5-42a3-9438-5569d46f49fd',
  'Barbell Ab Rollout',
  'abs',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Place a barbell on the floor at your feet.</p>
<p>Bending at the waist, grip the barbell with a shoulder with overhand grip.</p>
<p>With a slow controlled motion, roll the bar out so that your back is straight.</p>
<p>Roll back up raising your hips and butt as you return to the starting position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dae6f6ed-9408-4e62-a59a-1a33f4e8ab36',
  'Barbell Hack Squats',
  'other',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Perform leg squats with barbell behind your legs</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '04e7d7e4-f8d2-406d-97df-3df3bceec22c',
  'Barbell Lunges Standing',
  'quadriceps',
  '["glutes"]',
  'barbell',
  2.5,
  NULL,
  '<p>Put barbell on the back of your shoulders. Stand upright, then take the first step forward. Step should bring you forward so that your supporting legs knee can touch the floor. Then stand back up and repeat with the other leg.</p>
<p>Remember to keep good posture.</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '67c26c9b-32f3-4b8b-b13a-4d8be4803975',
  'Barbell Reverse Wrist Curl',
  'other',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Sitting on a bench, grab a barbell with your palms facing down and your hands shoulder-width apart. Rest your forearms on your thighs and allow your wrists to hang over your knees.</p>
<p>Curl your knuckles towards your face, lifting the barbell. Pause for a moment in the top position, then slowly return the barbell to the starting position.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '13234b53-ea0c-41f1-9069-776865ea8eff',
  'Extensión de triceps',
  'triceps',
  '["shoulders","chest"]',
  'barbell',
  2.5,
  NULL,
  'Coloque la barra sobre la cabeza con un agarre en pronación estrecho. Baje el antebrazo detrás de la parte superior del brazo con los codos sobre la cabeza. Extienda el antebrazo por encima de la cabeza. Baja y repite.',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cfb6a754-57be-431b-b8d0-d9963120bd5a',
  'Barbell Wrist Curl',
  'shoulders',
  '["biceps","abs"]',
  'barbell',
  2.5,
  NULL,
  '<p>Sitting on a bench, grab a barbell with your palms facing up and your hands shoulder-width apart. Rest your forearms on your thighs and allow your wrists to hang over your knees. Perform the movement by curling your palms and wrists towards your face.</p>
<p>Pause for a moment in the top position, then slowly return the barbell to the starting position.</p>
<p> </p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '03db11cc-8079-463c-9399-6f346b100ce6',
  'Abdominal Stabilization',
  'abs',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b7267f90-8706-442b-b918-507e16092b8e',
  'Bear Walk',
  'shoulders',
  '["glutes","back","abs","quadriceps","traps"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>-Rest your weight on your palms and the balls of your feet, not dissimilar to normal pushup position</p>
<p>-Move by stepping with your R palm and L foot, then your L palm and R foot.  Basically, walk like a lumbering bear.</p>
<p>-Move as fast as you can.  Measure your reps/sets in either distance (i.e. 40 yards) or time (i.e. 45 seconds)</p>
<p>-Works your Pecs, Deltoids, Triceps, Traps, Lats, Abs and Lower Back, Hip Flexors, Quads, Glutes and Calves</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '046fce45-69f2-46f7-a5b6-79a25a485af1',
  'Single Leg Extension',
  'quadriceps',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3717d144-7815-4a97-9a56-956fb889c996',
  'Bench Press',
  'chest',
  '["shoulders","triceps"]',
  'barbell',
  2.5,
  NULL,
  '<p>Lay down on a bench, the bar should be directly above your eyes, the knees are somewhat angled and the feet are firmly on the floor. Concentrate, breath deeply and grab the bar more than shoulder wide. Bring it slowly down till it briefly touches your chest at the height of your nipples. Push the bar up.</p>
<p>If you train with a high weight it is advisable to have a <em>spotter</em> that can help you up if you can''t lift the weight on your own.</p>
<p>With the width of the grip you can also control which part of the chest is trained more:</p>
<ul>
<li>wide grip: outer chest muscles</li>
<li>narrow grip: inner chest muscles and triceps</li>
</ul>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '28321cf3-70e6-48a4-ade1-d11382180cb3',
  'Benchpress Dumbbells',
  'chest',
  '["shoulders","triceps"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>The movement is very similar to benchpressing with a barbell, however, the weight is brought down to the chest at a lower point.</p>
<p>Hold two dumbbells and lay down on a bench. Hold the weights next to the chest, at the height of your nipples and press them up till the arms are stretched. Let the weight slowly and controlled down.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3db63138-a047-4a4d-b616-1a0b7dfca105',
  'Bench Press Narrow Grip',
  'triceps',
  '["shoulders","chest"]',
  'barbell',
  2.5,
  NULL,
  '<p>Lay down on a bench, the bar is directly over your eyes, the knees form a slight angle and the feet are firmly on the ground. Hold the bar with a narrow grip (around 20cm.). Lead the weight slowly down till the arms are parallel to the floor (elbow: right angle), press then the bar up. When bringing the bar down, don''t let it down on your nipples as with the regular bench pressing, but somewhat lower.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '01271ea0-088c-4e2b-95ad-876af7127057',
  'Bent High Pulls',
  'traps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Bend over slightly while holding two dumbbells.  Pull the dumbbells up to your chest, keeping your elbows as high as you can.</p>',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '94a5c406-7bcd-47f3-9687-bdf92a763932',
  'Remo con mancuernas',
  'back',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Con las mancuernas en la mano, flexiona la cadera hasta que las manos cuelguen justo por debajo de las rodillas (similar a la posición inicial de pierna recta). Mantenga constante el ángulo de la parte superior del cuerpo mientras contrae los músculos dorsales para llevar los codos hacia atrás, pellizcando los omóplatos en la parte superior. Intenta no levantarte en cada repetición, comprueba que las manos quedan por debajo de las rodillas en cada repetición.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6f79b381-98a4-40d5-8a45-3bb0558be6fe',
  'Bent-over Lateral Raises',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Sit on bench while holding weights. Bend forward as far as possible, with arms slightly bent at the elbow. Perform a lateral raise while maintaining the bend in your elbow.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4af6dbd9-8991-484b-9810-68f117c21edf',
  'Bent Over Rowing',
  'back',
  '["shoulders","biceps"]',
  'barbell',
  2.5,
  NULL,
  '<ol>
<li>Holding a barbell with a pronated grip (palms facing down), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The barbell should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.</li>
<li>Now, while keeping the torso stationary, breathe out and lift the barbell to you. Keep the elbows close to the body and only use the forearms to hold the weight. At the top contracted position, squeeze the back muscles and hold for a brief pause.</li>
<li>Then inhale and slowly lower the barbell back to the starting position.</li>
<li>Repeat for the recommended amount of repetitions.</li>
</ol>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2f0ddf9a-f520-4c55-8883-f0d4a789f481',
  'Bent Over Rowing Reverse',
  'back',
  '["shoulders","biceps"]',
  'barbell',
  2.5,
  NULL,
  '<p>The same as <em>regular</em> rowing, but holding a reversed grip (your palms pointing forwards):</p>
<p>Grab the barbell with a wide grIp (slightly more than shoulder wide) and lean forward. Your upper body is not quite parallel to the floor, but forms a slight angle. The chest''s out during the whole exercise.</p>
<p>Pull now the barbell with a fast movement towards your belly button, not further up. Go slowly down to the initial position. Don''t swing with your body and keep your arms next to your body.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7b99a081-6b1a-4aa5-b86a-5a935d083a35',
  'Biceps Curls With Barbell',
  'biceps',
  '["biceps"]',
  'barbell',
  2.5,
  NULL,
  '<p>Hold the Barbell shoulder-wide, the back is straight, the shoulders slightly back, the arms are streched. Bend the arms, bringing the weight up, with a fast movement. Without pausing, let down the bar with a slow and controlled movement.</p>
<p>Don''t allow your body to swing during the exercise, all work is done by the biceps, which are the only mucles that should move (pay attention to the elbows).</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1ae6a28d-10e7-4ecf-af4f-905f8193e2c6',
  'Curl de bíceps con mancuerna',
  'biceps',
  '["biceps"]',
  'dumbbell',
  2.5,
  NULL,
  'Sujeta dos pesas, los brazos estirados, las manos a los lados, las palmas hacia dentro. Flexiona los brazos y sube el peso con un movimiento rápido. Al mismo tiempo, gira los brazos 90 grados al principio del movimiento. En el punto más alto, gira un poco las pesas hacia fuera. Sin pausa, bájalas lentamente.No permitas que tu cuerpo se balancee durante el ejercicio, todo el trabajo lo realizan los bíceps, que son los únicos músculos que deben moverse (presta atención a los codos).',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '42227131-9b1e-4220-b082-c523f0651057',
  'Curl de biceps con barra Z',
  'biceps',
  '["biceps"]',
  'barbell',
  2.5,
  NULL,
  'Sostenga la barra SZ a la altura de los hombros, la espalda recta, los hombros ligeramente hacia atrás, los brazos estirados. Dobla los brazos, elevando el peso, con un movimiento rápido. Sin pausa, baja la barra con un movimiento lento y controlado.

No dejes que tu cuerpo se balancee durante el ejercicio, todo el trabajo lo hacen los bíceps, que son los únicos músculos que deben moverse (presta atención a los codos).',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'bcb7020c-8678-496d-8f4d-aad0e233a5bd',
  'Biceps Curl With Cable',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Stand around 30 - 40cm away from the cable, the feet are firmly on the floor. Take the bar and lift the weight with a fast movements. Lower the weight as with the dumbbell curls slowly and controlled.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd551f24d-44fe-4761-9448-edf14d627827',
  'Body-Ups',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol>
<li>Assume a plank position on the ground. You should be supporting your bodyweight on your toes and forearms, keeping your torso straight. Your forearms should be shoulder-width apart. This will be your starting position.</li>
<li>Pressing your palms firmly into the ground, extend through the elbows to raise your body from the ground. Keep your torso rigid as you perform the movement.</li>
<li>Slowly lower your forearms back to the ground by allowing the elbows to flex.</li>
<li>Repeat as needed.</li>
</ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8c6428f3-d41d-4ffc-8444-bb9b823bc42b',
  'Braced Squat',
  'quadriceps',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  '<p>Stand with feet slightly wider than shoulder-width apart, while standing as tall as you can.</p>
<p>Grab a weight plate and hold it out in front of your body with arms straight out. Keep your core tight and stand with a natural arch in your back.</p>
<p>Now, push hips back and bend knees down into a squat as far as you can. Hold for a few moments and bring yourself back up to the starting position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5c414175-fe72-455a-ba8f-a0575cf792bd',
  'Chest Press',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '48ee1385-47c5-4821-8b6a-57fac6130776',
  'Burpees',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Jump, lay down on your chest, do a pushup then jump, repeat</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '99449eae-0eae-44ab-a57f-fc094bbdda13',
  'Butterfly',
  'chest',
  '["shoulders"]',
  'other',
  2.5,
  NULL,
  '<p>Sit on the butterfly machine, the feet have a good contact with the floor, the upper arms are parallel to the floor. Press your arms together till the handles are practically together (but aren''t!). Go slowly back. The weights should stay all the time in the air.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '80ff0a3a-ae45-497d-8c27-2b12e3b6e1b8',
  'Butterfly Narrow Grip',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>The movement is the same as with a regular butterfly, only that the grip is narrow:</p>
<p>Sit on the butterfly machine, the feet have a good contact with the floor, the upper arms are parallel to the floor. Press your arms together till the handles are practically together (but aren''t!). Go slowly back. The weights should stay all the time in the air.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a6605e9c-887d-45e0-8282-617a8ec5fea2',
  'Butterfly Reverse',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dc3a2072-abc3-4ef9-b8e6-f5ae6b11bc7f',
  'Cable External Rotation',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Steps:</p>
<ol>
<li>Start off placing an extension band around a post or in a secure position where it will not release and is at elbow level.</li>
<li>Position yourself to the side of the band and with your hand that is opposite of the band, reach out and grab the handle.</li>
<li>Bring the band to your chest keeping your elbow bent in a 90 degree angle then slowly rotate your arm in a backhand motion so that the band externally rotates out</li>
<li>Continue out as far as possible so that you feel a stretch in your shoulders, hold for a count and then return back to the starting position.</li>
<li>Repeat for as many reps and sets as desired.</li>
</ol>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c867836d-2929-4977-b23c-014bc21ec08d',
  'Cable Woodchoppers',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Set cable pulley slightly lower than chest height. Keep body facing forward with hips stable.  Grab the pulley handle, fully extend your arms and bring your arms forward and across your body. Hold for 1 second at the end of the movement and slowly return to starting position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0d79f259-3b28-4258-8a08-cffec062a710',
  'Calf Press Using Leg Press Machine',
  'calves',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Put  the balls of your feet on an extended leg press pad.  Use your calves to press the weight by flexing your feet/toes into a pointed position, and releasing back into a relaxed position.</p>
<p>This exercise builds mass and strength in the Gastrocnemius and Soleus muscles as well, if not better, than any calf exercise.</p>',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '95a9cc46-270e-45f2-8a17-5665a23ff70b',
  'Calf Raises on Hackenschmitt Machine',
  'calves',
  '["calves"]',
  'other',
  2.5,
  NULL,
  '<p>Place yourself on the machine with your back firmly against the backrest, the feet are on the platform for calf raises. Check that the feet are half free and that you can completely stretch the calf muscles down.</p>
<p>With straight knees pull up your weight as much as you can. Go with a fluid movement down till the calves are completely stretched. Repeat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '87e6abc5-a701-442a-b4fb-bb2a7598a754',
  'Chin Up',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'The chin-up (also known as a chin or chinup) is a strength training exercise. People frequently do this exercise with the intention of strengthening muscles such as the latissimus dorsi and biceps, which extend the shoulder and flex the elbow, respectively. In this maneuver, the palms are faced towards the body. It is a form of pull-up in which the range of motion is established in relation to a person''s chin.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '424da49e-d155-4247-bbb2-161a5c797789',
  'Dominadas Supinas',
  'back',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Ejercicio en barra de dominadas para fortalecer la musculatura relacionada con el tirón: dorsales. En menor medida se trabajan los bíceps',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '63fbb8e5-6ebc-4def-8844-3e65e097213b',
  'Close-grip Lat Pull Down',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Grip the pull-down bar with your hands closer than shoulder width apart, with your palms facing away from you. Lean back slightly. Pull the bar down towards your chest, keeping your elbows close to your sides as you come down. Pull your shoulders back at the end of the motion.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6e00afb6-272d-44a2-8ae3-e7fa41b50f06',
  'Cross-Bench Dumbbell Pullovers',
  'back',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Grasp a moderately weighted dumbbell so your palms are flat against the underside of the top plates and your thumbs are around the bar. Lie on your back across a flat bench so only your upper back and shoulders are in contact with the bench. Your feet should be set about shoulder-width apart and your head should hang slightly downward. With the dumbbell supported at arm''s length directly about your chest, bend your arms about 15 degrees and keep them bent throughout the movement. Slowly lower the dumbbell backward and downward in a semicircle arc to as low a position as is comfortably possible. Raise it slowly back along the same arc to the starting point, and repeat for the required number of repetitions.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '36391719-d4ad-4e0f-991f-8eafd5947108',
  'Ball crunches',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b186f1f8-4957-44dc-bf30-d0b00064ce6f',
  'Abdominales',
  'abs',
  '["chest"]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Acuéstese boca arriba en el suelo con las rodillas dobladas.</li><li>Flexione los hombros hacia la pelvis. Las manos pueden estar detrás o al costado del cuello o cruzadas sobre el pecho.</li><li>Repita</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7de7b8a8-313d-465f-bb22-8527ae45110a',
  'Crunches on incline bench',
  'abs',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '401989e0-64c3-459d-bc47-2c171ab4f41d',
  'Crunches on Machine',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>The procedure is very similar as for regular crunches, only with the additional weight of the machine. Sit on the machine, put both feet firmly on the ground. Grab the to the weights, cables, etc. and do a rolling motion forwards (the spine should ideally lose touch vertebra by vertebra). Slowly return to the starting position. </p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '29175281-afaf-4ffd-85e8-cfc38493e304',
  'Crunches With Cable',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Take the cable on your hands and hold it next to your temples. Knee down and hold your upper body straight and bend forward. Go down with a fast movement, rolling your back in (your ellbows point to your knees). Once down, go slowly back to the initial position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b7ff64bc-7a7c-4dbc-af6f-fabc20425f5f',
  'Crunches With Legs Up',
  'abs',
  '["abs"]',
  'other',
  2.5,
  NULL,
  '<p>On your back, legs extended straight up, reach toward your toes with your hands and lift your shoulder blades off the ground and back.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8dedde58-a5dc-4a23-ad20-fd7cf524f8b5',
  'Cycling',
  'abs',
  '["hamstrings","biceps","glutes","back","quadriceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Cycling, also called bicycling or biking, is the use of bicycles for transport, recreation, exercise or sport. People engaged in cycling are referred to as cyclists, bicyclists, or bikers. Apart from two-wheeled bicycles, cycling also includes the riding of unicycles, tricycles, quadracycles, recumbent and similar human-powered vehicles.',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd4db2355-4c99-4d80-a179-6aeced7c7fed',
  'Deadbug',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Lie on your back, with your hips and knees bent to 90°. Raise both arms toward the ceiling. Pull your lower back to the floor to eliminate the gap. Start by pressing one leg out, and tapping the heel to the floor. "As you extend one leg, exhale as much as you can, keeping your lower back glued to the floor," Dunham says. When you can’t exhale any more, pull your knee back to the starting position. Make this more difficult by holding weight in your hands, or by lowering opposite arm and leg.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '74d4697d-8a97-4ea2-9d05-fa4d2bd7221e',
  'Deadhang',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Deadhang performed on an edge either with or without added weight (adujst edge or weight to adjust difficulty)</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ee8e8db4-2d82-49e1-ab7f-891e9a354934',
  'Deadlifts',
  'back',
  '["glutes"]',
  'barbell',
  2.5,
  NULL,
  '<p>Stand firmly, with your feet slightly more than shoulder wide apart. Stand directly behind the bar where it should barely touch your shin, your feet pointing a bit out. Bend down with a straight back, the knees also pointing somewhat out. Grab the bar with a shoulder wide grip, one underhand, one reverse grip.</p>
<p>Pull the weight up. At the highest point make a slight hollow back and pull the bar back. Hold 1 or 2 seconds that position. Go down, making sure the back is not bent. Once down you can either go back again as soon as the weights touch the floor, or make a pause, depending on the weight.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'bcd801f0-9a38-4615-a91c-900153c8c234',
  'Decline Bench Press Barbell',
  'chest',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Lay down on a decline bench, the bar should be directly above your eyes, the knees are somewhat angled and the feet are firmly on the floor. Concentrate, breath deeply and grab the bar more than shoulder wide. Bring it slowly down till it briefly touches your chest at the height of your nipples. Push the bar up.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dda69c96-62d4-4690-aa07-a4a0f6ceb63a',
  'Decline Bench Press Dumbbell',
  'chest',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Take two dumbbells and sit on a decline bench, the feet are firmly on the floor, the head is resting the bench. Hold the weights next to the chest, at the height of your nipples and press them up till the arms are stretched. Let the weight slowly and controlled down.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b99c91be-8805-4e15-9cb6-486b55b81ae1',
  'Decline Pushups',
  'chest',
  '["shoulders"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>With your feet raised approximately 30cm on a platform, align your shoulders, elbows and hands, then perform regular pushups. This emphasises the clavicular fibers of the pectoralis major.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e7a964cd-e68e-4926-bc7c-577065137e18',
  'Deficit Deadlift',
  'other',
  '["hamstrings","glutes","back","abs","calves"]',
  'barbell',
  2.5,
  NULL,
  '<p>Preparation</p>
<p>Stand on weight plate, bumper plate, or shallow elevated platform with loaded bar above feet. Squat down and grasp bar with shoulder width or slightly wider overhand or mixed grip.</p>
<p> </p>
<p>Execution</p>
<p>Lift bar by extending hips and knees to full extension. Pull shoulders back at top of lift if rounded. Return weights to floor by bending hips back while allowing knees to bend forward, keeping back straight and knees pointed same direction as feet. Repeat.</p>
<p> </p>
<p>Comments</p>
<p>Throughout lift, keep hips low, shoulders high, arms and back straight. Knees should point same direction as feet throughout movement. Keep bar close to body to improve mechanical leverage. Grip strength and strength endurance often limit ability to perform multiple reps at heavy resistances. Gym chalk, wrist straps, grip work, and mixed grip can be used to enhance grip. Mixed grip indicates one hand holding with overhand grip and other hand holding with underhand grip. Lever barbell jack can be used to lift barbell from floor for easier loading and unloading of weight plates.</p>
<p>Barbell Deficit Deadlift emphasizes building strength through lowest portion of Deadlift. Target muscle is exercised isometrically. Heavy barbell deadlifts significantly engages Latissmus Dorsi. See Barbell Deficit Deadlift under Gluteus Maximus. Also see Deadlift Analysis.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '14d5cdbc-9b17-4296-a282-0a81cd3c4c4e',
  'Diagonal Shoulder Press',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>You sit at the bench press device, back slightly tilted to the back. The bar should be about 20 cm in front of you. Then you push the bar and take it back again, as you would with a bench press.</p>
<p>In this position you strain your chest muscles a lot less, which is nice if you want to train, but your chest hasn''t recovered yet.</p>
<p>Here''s a link to a girl on a machine specialized for this exercise, to give a better description than my failing words above.</p>
<p>http://www.schnell-online.de/db_imgs/products/img/t-80400.jpg</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '09dd3e3c-e53a-4e2c-a2e3-645d334f53e2',
  'Dips',
  'chest',
  '["triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'A dip is an upper-body strength exercise. Narrow, shoulder-width dips primarily train the triceps, with major synergists being the anterior deltoid, the pectoralis muscles (sternal, clavicular, and minor), and the rhomboid muscles of the back (in that order).[1] Wide arm training places additional emphasis on the pectoral muscles, similar in respect to the way a wide grip bench press would focus more on the pectorals and less on the triceps.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7c8eb1ac-2d7e-4ca7-919a-1848ba38e0f4',
  'Dips Between Two Benches',
  'triceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Put two benches so far appart, that you can hold onto one with your hands and are just able to reach the other with your feet. The legs stay during the exercise completely stretched. With your elbows facing back, bend them as much as you can. Push yourself up, but don''t stretch out the arms.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '46e0f60c-fdc0-489a-82e4-a5b7476a5c21',
  'Dumbbell Concentration Curl',
  'biceps',
  '["biceps"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Sit on bench. Grasp dumbbell between feet. Place back of upper arm to inner thigh. Lean into leg to raise elbow slightly.</p>',
  'https://wger.de/static/images/muscles/main/muscle-13.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b7c6a444-90ea-4f5b-9fea-748311606eaa',
  'Dumbbell Goblet Squat',
  'quadriceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Grasp dumbbell with both hands at the sides of the upper plates. Hold dumbbell in front of chest, close to torso. Place feet about shoulderwide apart, keep knees slightly bent.</p>
<p>Squat down until thighs are parallel to floor. Keep back straight, bend and move hips backward to keep knees above feet. Return, keep knees slightly flexed. Repeat.</p>
<p>Keep bodyweight on heels and look ahead or slightly above to keep back straight.</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '43e85cb8-51d0-4892-b1bf-80a3cb111ff6',
  'Dumbbell Incline Curl',
  'biceps',
  '["biceps"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>With elbows back to sides, raise one dumbbell and rotate forearm until forearm is vertical and palm faces shoulder. Lower to original position and repeat with opposite arm. Continue to alternate between sides.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2f1a2707-e7ff-46ac-9112-3e31e6e961ee',
  'Dumbbell Lunges Standing',
  'quadriceps',
  '["glutes"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>.</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dcc6e237-a8bb-4eca-bbc5-7fb852636f6a',
  'Dumbbell Lunges Walking',
  'quadriceps',
  '["glutes"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Take two dumbbells in your hands, stand straight, feet about shoulder wide. Take one long step so that the front knee is approximately forming a right angle. The back leg is streched, the knee is low but doesn''t touch the ground. "Complete" the step by standing up and repeat the movement with the other leg.</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fe328b2b-cc6d-4f12-a2c6-85ce374217c7',
  'Dumbbells on Scott Machine',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd8bddb58-91b0-4d7b-8ec1-cd742584b607',
  'Dumbbell Triceps Extension',
  'triceps',
  '["shoulders","chest"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Position one dumbbell over head with both hands under inner plate (heart shaped grip).</p>
<p>With elbows over head, lower forearm behind upper arm by flexing elbows. Flex wrists at bottom to avoid hitting dumbbell on back of neck. Raise dumbbell over head by extending elbows while hyperextending wrists. Return and repeat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd7a418d4-d0cb-4f85-8a7c-1e9d97152cbd',
  'Face pull',
  'traps',
  '[]',
  'other',
  2.5,
  NULL,
  'Conecte una cuerda a una estación de polea colocada aproximadamente al nivel del pecho. Da un paso atrás para que estés soportando el peso con los brazos completamente extendidos y asume una postura escalonada (un pie hacia adelante). Doble las rodillas ligeramente para tener una base estable. Retraiga las escápulas (apriete el dedo de su compañero con los omóplatos) y tire del centro de la cuerda ligeramente hacia la cara. Una buena señal es pensar en separar los extremos de la cuerda, no solo en tirar hacia atrás. A medida que se acerca a su cara, gire externamente para que sus nudillos queden mirando hacia el techo. Mantenga durante un segundo en la posición superior y baje lentamente.',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fdc550b6-ec58-4023-ba62-b54045e9a10d',
  'Flutter Kicks',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>-Laying on the back, lift your straightened legs from the ground at a 45 degree angle. </p>
<p>-As your Left foot travels downward and nearly touches the floor, your Right foot should seek to reach a 90 degree angle, or as close to one as possible.</p>
<p>-Bring your R foot down until it nearly touches the floor, and bring your L foot upwards.  Maintain leg rigidity throughout the exercise.  Your head should stay off the ground, supported by tightened upper abdominals.</p>
<p>-(L up R down, L down R up, x2)  ^v, v^, ^v, v^ = 1 rep</p>
<p>-Primarily works the Rectus Abdominus, the hip flexors and the lower back. Secondarily works the Obliques.  Emphasis placed on the lower quadrant of the abs.</p>
<p> </p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '07c5b9f4-2be5-4a3d-b6d2-16235da1ae3a',
  'Fly With Cable',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '95d226ad-3bf7-4cd6-aa64-2f26b526d8b6',
  'Fly With Dumbbells',
  'chest',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Take two dumbbells and lay on a bench, make sure the feet are firmly on the ground and your back is not arched, but has good contact with the bench. The arms are stretched in front of you, about shoulder wide. Bend now the arms a bit and let them down with a half-circle movement to the side. Without changing the angle of the elbow bring them in a fluid movement back up.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '55d0a5ec-b147-40c3-aa77-314e61c93689',
  'Fly With Dumbbells, Decline Bench',
  'chest',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>The exercise is the same as with a regular bench:</p>
<p>Take two dumbbells and lay on a bench, make sure the feet are firmly on the ground and your back is not arched, but has good contact with the bench. The arms are stretched in front of you, about shoulder wide. Bend now the arms a bit and let them down with a half-circle movement to the side. Without changing the angle of the elbow bring them in a fluid movement back up.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '893c07ea-2e24-49b6-92e4-d0033eedec62',
  'Skullcrusher Dumbbells',
  'triceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Hold the dumbbells and lay down on a flat bench in such a way that around 1/4 of your head is over the edge. Stretch arms straight up and then lean dumbbells away from your toes to a 10-20 degree angle. Keep upper arm at this angle throughout exercise. Dumbbell shall not be amed at your head, but away over your head. This will maximise gain from exercise with load on triceps all the time.</p>
<p>Pay attention to your elbows and arms: only the triceps are doing the work, the rest of the arms should not move.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '95a7e546-e8f8-4521-a76b-983d94161b25',
  'Skullcrusher SZ-bar',
  'triceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Hold the SZ-bar and lay down on a flat bench in such a way that around 1/4 of your head is over the edge. Stretch your arms with the bar and bend them so that the bar is lowered. Just before it touches your forehead, push it up.</p>
<p>Pay attention to your elbows and arms: only the triceps are doing the work, the rest of the arms should not move.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '68e0dbba-2d1e-4a56-8378-8824c1de3342',
  'Front Raises with Plates',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9c35594c-bbcc-4656-bdcb-376814c90e96',
  'Elevaciones frontales',
  'shoulders',
  '[]',
  'barbell',
  2.5,
  NULL,
  'Para ejecutar el ejercicio, el levantador se para con los pies separados al ancho de los hombros y las pesas o los mangos de resistencia se sostienen a los lados con un agarre en pronación (por encima de la cabeza).

El movimiento consiste en llevar los brazos por delante del cuerpo a la altura de los ojos y con sólo una ligera flexión del codo. Esto aísla el músculo deltoides anterior (frente al hombro) y utiliza el deltoides anterior para levantar el peso.

Al levantar es importante mantener el cuerpo inmóvil para que el deltoides anterior se utilice por completo; si el peso no se puede levantar estando quieto, entonces es demasiado pesado y se necesita un peso menor. Es importante mantener una ligera flexión en el codo al levantar, ya que mantener el codo trabado agregará tensión a la articulación del codo y podría causar lesiones.

También se puede usar un agarre neutral, similar al que se usa en el curl de martillo. Con esta variación, el peso se eleva nuevamente al nivel de los ojos, pero en un ángulo de 45 grados desde la parte frontal del cuerpo. Esto puede ser beneficioso para las personas con lesiones en el hombro, en particular las relacionadas con el manguito de los rotadores.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd677de4c-5bd9-412a-91f1-857116a666a2',
  'Front Squats',
  'glutes',
  '["abs"]',
  'barbell',
  2.5,
  NULL,
  '<p>Squats</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6260e3aa-e46b-4b4b-8ada-58bfd0922d3a',
  'Front pull wide',
  'back',
  '["shoulders","biceps"]',
  'barbell',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5b4b94ca-f429-4394-9477-c00be8f2bb04',
  'Front Pull narrow',
  'back',
  '["biceps"]',
  'barbell',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e5a62151-5350-4c86-8a19-3e9ca7bf0f38',
  'Full Sit Outs',
  'glutes',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>(A) Get in high plank position on your hands and toes.(B) Shift your weight to your left hand as you turn your body to the right; bend your right leg behind you and extend your right arm up. Return to the center and repeat on the opposite side. Continue, alternating sides.<strong>Make it easier:</strong> Don’t raise your arm after you bend your leg behind you.<strong>Make it harder:</strong> Balance with your arm and leg extended for two counts.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ceb0c2d0-06ac-4a49-89e7-8d7b1c1e5672',
  'Glute Bridge',
  'glutes',
  '["hamstrings"]',
  'other',
  2.5,
  NULL,
  '<p>Lie on you back with your hips and knees flexed, feet on the ground. From this position, raise your butt off of the ground to a height where your body makes a straight line from your knees to your shoulders. To make the exercise more intense, you can add weight by letting a barbell rest on your hips as you complete the motion, or you can put your feet on a slightly higher surface such as a step or a bench.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fb928a58-9e24-4e7b-b714-71a5f759e8d6',
  'Good Mornings',
  'hamstrings',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c0d9fe98-f4fe-49f3-8037-05e1984e7d2d',
  'Hammercurls',
  'biceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Hold two dumbbells and sit on a bench with a straight back, the shoulders are slightly rolled backwards. Your pals point to your body. Bend the arms and bring the weight up with a fast movement. Don''t rotate your hands, as with the curls. Without any pause bring the dumbbell down with a slow, controlled movement.</p>
<p>Don''t swing your body during the exercise, the biceps should do all the work here. The elbows are at your side and don''t move.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '04365177-e078-489b-983a-8ac61b7346f1',
  'Hammercurls on Cable',
  'biceps',
  '["biceps"]',
  'other',
  2.5,
  NULL,
  '<p>Take a cable in your hands (palms parallel, point to each other), the body is straight. Bend the arms and bring the weight up with a fast movement. Without any pause bring it back down with a slow, controlled movement, but don''t stretch completely your arms.</p>
<p>Don''t swing your body during the exercise, the biceps should do all the work here. The elbows are at your side and don''t move.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4e238360-a4c1-4509-85c1-f96d01e69cf9',
  'Hand Grip',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>chrome Hand Flex Grip to build up forearms muscles</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7704e810-c05d-47cc-a384-265e0231a497',
  'Handstand Pushup',
  'traps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'The handstand push-up (press-up) - also called the vertical push-up (press-up) or the inverted push-up (press-up) also called commandos- is a type of push-up exercise where the body is positioned in a handstand. For a true handstand, the exercise is performed free-standing, held in the air. To prepare the strength until one has built adequate balance, the feet are often placed against a wall, held by a partner, or secured in some other way from falling. Handstand pushups require significant strength, as well as balance and control if performed free-standing.',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9b993e99-8701-43f0-84d6-689123183880',
  'Hanging Leg Raises',
  'abs',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Hanging from bar or straps, bring legs up with knees extended or flexed</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8381f40c-3168-4d98-af60-6a89800dd308',
  'Hercules Pillars',
  'biceps',
  '["shoulders"]',
  'other',
  2.5,
  NULL,
  '<p>Grab two cables stand in the middle so both have tension and hold</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3edbb63e-f326-4bd0-8af3-2d5deabb864f',
  'High Knee Jumps',
  'hamstrings',
  '["abs","chest"]',
  'other',
  2.5,
  NULL,
  '<p>-Start with legs slightly wider than shoulder width</p>
<p>-Drop into a bodyweight squat</p>
<p>-As you hit the bottom of the squat, explode upwards into a jump while simultaneously tucking your knees into your chest midflight.  Remain tucked until the apex of your jump.</p>
<p>-Land on both feet, making sure your knees are not locked so as to avoid excessive strain upon your joints.  Collect yourself into the next rep as quickly but under control as possible.</p>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b526b17b-408d-4da2-8940-ceaf9dae9d93',
  'High Pull',
  'shoulders',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  '<p>Use a light barbell, perform explosive lift up starting from underneath knee cap level. Lift/raise explosively using hips, at shoulder level. Tempo: 2111</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1d610575-eed0-42cf-8737-29788a372af6',
  'Hindu Squats',
  'quadriceps',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  '<p>Start with your feet shoulder width apart and arms slightly behind your back.</p>
<p>As you descend towards the floor, raise your heels off the ground, while keeping your back as vertical  as possible. </p>
<p>Upon attaining the bottom position, touch the hands to the heels.</p>
<p>Then stand up ending with the heels on the ground, arms extended in front of the chest then rowing into the start position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '541941e0-0fa5-4474-a382-9baf04948f8d',
  'Hip Raise, Lying',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Lying down on your back, with your feet flat on the floor. Raise your hips up evenly as high as you can and hold for as long as you can.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '19a289c0-33af-4055-bb34-3570c2975d3d',
  'Barbell Hip Thrust',
  'glutes',
  '[]',
  'barbell',
  2.5,
  NULL,
  'Siéntate en el suelo con un banco detrás de ti, dobla las rodillas para que tus pies estén plantados en el suelo y sujeta una barra que descanse debajo de tus caderas. Si tienes una barra acolchada o algo que puedas colocar entre la barra y tu cuerpo, te resultará más cómodo.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd059c63d-0a81-48a3-912a-44070c0def2e',
  'Hollow Hold',
  'abs',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Get on a mat and lie on your back. Contract your abs, stretch your raise and legs and raise them (your head and shoulders are also be raised). Make sure your lower back remains in contact with the mat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '37f6bd56-815a-4975-99af-05e749fae4b2',
  'Hyperextensions',
  'traps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Sdraiarsi sul cuscino per iperestensione con l''ombelico in corrispondenza del bordo anteriore, mentre la parte superiore del corpo può pendere liberamente. Tendete tutti i muscoli della schiena e portate il busto in alto fino a raggiungere l''orizzontale, ma non oltre. Scendere lentamente e non rilassare i muscoli.</p>',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '55ff32e6-24ab-4303-9b50-176d60d48796',
  'Incline Dumbbell Fly',
  'chest',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Use inclined bench. Hold dumbbells straight out to your sides, elbows slightly bent. Bring arms together above you, keeping angle of elbows fixed.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '27eb3d4a-8677-4c1f-bf34-251e2b4741cb',
  'Incline Dumbbell Row',
  'other',
  '["back"]',
  'dumbbell',
  2.5,
  NULL,
  '<ol>
<li>Using a neutral grip, lean into an incline bench.</li>
<li>Take a dumbbell in each hand with a neutral grip, beginning with the arms straight. This will be your starting position.</li>
<li>Retract the shoulder blades and flex the elbows to row the dumbbells to your side.</li>
<li>Pause at the top of the motion, and then return to the starting position.</li>
</ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'aae91ecf-ffa4-4730-812c-cb00e423f91c',
  'Incline Plank With Alternate Floor Touch',
  'abs',
  '["abs"]',
  'other',
  2.5,
  NULL,
  '<p>Perform the plank with legs elevated, feet on a gymball. Once stabilised, slowly move one foot sideways off the ball, then make it touch the floor, then come back to starting position. Alternate with the other foot.</p>
<p>This is a core exercise.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '312017c4-c431-46b2-86dd-b9f480617d6f',
  'Incline Push up',
  'chest',
  '["hamstrings"]',
  'other',
  2.5,
  NULL,
  '<p>Regular push with a 30 degree incline.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2f5032de-df6d-406b-b709-9223ef5c3e24',
  'Isometric Wipers',
  'chest',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Assume push-up position, with hands slightly wider than shoulder width.</p>
<p>Shift body weight as far as possible to one side, allowing the elbow on that side to flex. </p>
<p>Reverse the motion, moving completely over to the other side.</p>
<p>Return to the starting position, and repeat for the desired number of repetitions.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'eeeb42ae-6a41-4127-b2ec-72376119531b',
  'Jogging',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Get your shoes on, go outside and start running at a moderate pace.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4d255f25-f199-401a-bc81-7ffab1d0ed24',
  'Polichilenas',
  'quadriceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<ol><li>Párese con los pies juntos y los brazos a los lados</li><li>Salte a una posición con las piernas abiertas y las manos tocandose por encima de la cabeza</li><li>Repita</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b16e3e5d-8401-4d2b-919c-15b536f9ec5e',
  'Cable Cross-over',
  'chest',
  '["shoulders"]',
  'other',
  2.5,
  NULL,
  '<p>Begin with cables at about shoulder height, one in each hand. Take a step forward so that one foot is in front of the other, for stability, and so that there is tension on the cables. Bring hands together in front of you. Try to make your hands overlap (so that the cables cross) a few inches.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8b311259-4f67-4dbf-9574-8c38faa92160',
  'Kettlebell Swings',
  'glutes',
  '["hamstrings"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Hold the kettlebell securely in both hands. Keep your back flat throughout the move, avoiding any rounding of the spine.Keeping your knees "soft", hinge your hips backwards, letting the kettlebell swing between your knees.</p>
<p>You want to bend from the hips as far as you can <em>without letting your back round forwards</em>. Then, snap your hips forwards quickly and standing up straight, locking your body in an upright posture.</p>
<p>The speed you do this will cause your arms and the kettlebell to swing up in front of you. Don''t try to <em>lift</em> the kettlebell with your arms. The snapping forwards of your hips will cause the kettlebell to swing forwards through momentum. Depending on the weight of the kettlebell and the speed of your hip movement, your arms will swing up to about shoulder height. At the top of this swing, let your hips hinge backwards again as the kettlebell swings back down to between your legs and the start of the next repetition.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '316aca47-6f5b-40b7-b04f-f69e68387354',
  'Squats on Multipress',
  'quadriceps',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '91c47c8b-6290-4885-8921-df9aa7958c00',
  'Landmine press',
  'shoulders',
  '["chest","triceps"]',
  'barbell',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '63375f5b-2d81-471c-bea4-fc3d207e96cb',
  'Lateral Raises',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'This exercise works the deltoid muscle of the shoulder. The movement starts with the arms straight, and the hands holding weights at the sides or in front of the body. Body is in a slight forward-leaning position with hips and knees bent a little. Arms are kept straight or slightly bent, and raised through an arc of movement in the coronal plane that terminates when the hands are at approximately shoulder height. Weights are lowered to the starting position, completing one rep. When using a cable machine the individual stands with the coronal plane in line with the pulley, which is at or near the ground.[9] The exercise can be completed one shoulder at a time (with the other hand used to stabilize the body against the weight moved), or with both hands simultaneously if two parallel pulleys are available.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '57263316-6f34-4539-952b-b07e09bac3ba',
  'Lateral Rows on Cable, One Armed',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Set cable at waist height, start with arm across your belly and move han over and out too other side, one arm at the time.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dac3c714-f0c6-4d97-8283-17be7dd77b65',
  'Lateral-to-Front Raises',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>-(1) Perform a lateral raise, pausing at the top of the lift (2).</p>
<p>-Instead of lowering the weight, bring it to the front of your body so that you appear to be at the top position of a front raise.  You will do this by using a Pec Fly motion, maintaining straight arms. (3)</p>
<p>-Now lower the weight to your quadriceps, or, in other words, lower the dumbbells as though you are completing a Front Raise repetition. (4)</p>
<p>-Reverse the motion:  Perform a front raise (5), at the apex of the lift use a Reverse Fly motion to position the weights at the top of a Lateral Raise (6), and finally, lower the weights until your palms are essentially touching the sides of your thighs (7).  THIS IS ONE REP.</p>
<p>(1) l  <em>front view  </em>(2) -l- <em> FV  </em>  (3) l-  <em>side view</em>   (4) l  <em>SV/FV</em>   (5) l-  <em>SV  </em> (6) -l-  <em>FV  </em>  (7)  l  <em>FV/SV</em></p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8c496646-baa8-4ed3-97b1-702e213fdeca',
  'Lat Pull Down (Leaning Back)',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Lean Back, Pull into chest</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fff05d7a-f374-4c8a-9885-39f49076918f',
  'Lat Pull Down (Straight Back)',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Pull bar down to strenum and keep straight back.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '48836f44-efcd-4471-a456-5f024936025a',
  'Curl femoral',
  'hamstrings',
  '[]',
  'other',
  2.5,
  NULL,
  'El curl de piernas, también conocido como curl de isquiotibiales, es un ejercicio de aislamiento que se enfoca en los músculos isquiotibiales. El ejercicio consiste en flexionar la parte inferior de la pierna contra la resistencia hacia las nalgas. Otros ejercicios que se pueden utilizar para fortalecer los isquiotibiales son las elevaciones de glúteos y isquiotibiales y el peso muerto.',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3bc8b411-a28d-4e1c-a6d1-769e18fe9881',
  'Leg Curls (laying)',
  'hamstrings',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Lay on a bench and put your calves behind the leg holder (better if they are hold on around the lower calves). Hold a grip on the bars to make sure the body is firmly in place. Bend your legs bringing the weight up, go slowly back. During the exercise the body should not move, all work is done by the legs.</p>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '440a5184-de58-4a86-a7ba-76ddeafaa855',
  'Leg Curls (sitting)',
  'hamstrings',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '49189e88-40b6-4c0d-a784-0cc3abbb8e75',
  'Leg Curls (standing)',
  'hamstrings',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '62170477-90ec-463c-907e-9e523abc0a15',
  'Curl cuadriceps',
  'quadriceps',
  '[]',
  'other',
  2.5,
  NULL,
  'La extensión de piernas es un ejercicio de entrenamiento con pesas de resistencia que se enfoca en el músculo cuádriceps de las piernas. El ejercicio se realiza utilizando una máquina llamada Leg Extension Machine. Hay varios fabricantes de estas máquinas y cada uno es ligeramente diferente. La mayoría de los gimnasios y salas de pesas tendrán la máquina en sus instalaciones. La extensión de piernas es un ejercicio aislado dirigido a un grupo muscular específico, los cuádriceps. No debe considerarse como un entrenamiento total de piernas, como la sentadilla o el peso muerto. El ejercicio consiste en doblar la pierna a la altura de la rodilla y extender las piernas, para luego volver a bajarlas a la posición original.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '66a42396-c207-44da-bc75-758a89d32404',
  'Prensa de piernas',
  'hamstrings',
  '["calves","glutes"]',
  'other',
  2.5,
  NULL,
  'La prensa de piernas es un ejercicio de entrenamiento con pesas en el que el individuo empuja un peso o una resistencia con las piernas.',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5f0b757c-0d6a-430b-9d5e-3bfba202878e',
  'Prensa de piernas cerrada',
  'quadriceps',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  'El ejercicio es muy similar a la prensa de pierna ancha:

Siéntese en la máquina y coloque los pies en la plataforma tan separados que podría poner otro pie entre ellos. Los pies son paralelos y apuntan hacia arriba.

Baje tanto el peso, que las rodillas formen un ángulo recto. Vuelva a empujar inmediatamente la plataforma hacia arriba, sin ninguna pausa. Cuando está en la posición más baja, las rodillas apuntan un poco hacia afuera y el movimiento debe ser siempre fluido.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '661287d4-d1dc-485c-896b-73f90b000536',
  'Press de piernas abierto',
  'quadriceps',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  'Siéntese en la máquina y coloque los pies en la plataforma, un poco más anchos que los hombros. Los pies están girados hacia afuera unos pocos grados.

Baje tanto el peso, que las rodillas formen un ángulo recto. Vuelva a empujar inmediatamente la plataforma hacia arriba, sin ninguna pausa. Cuando está en la posición más baja, las rodillas apuntan un poco hacia afuera y el movimiento debe ser siempre fluido.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '18104387-4567-4c1e-8d03-db0b274646dd',
  'Leg Press on Hackenschmidt Machine',
  'quadriceps',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c2078aac-e4e2-4103-a845-6252a3eb795e',
  'Levantamiento de piernas',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Posición inicial:</p><p>Túmbate de espaldas, con los pies juntos y los brazos a los lados.</p><p>Pasos:</p><ol><li>Dobla las rodillas y luego enderézalas para que apunten hacia arriba.</li><li>Manteniendo las piernas rectas, bájalas juntas sin tocar el suelo. Cuanto más bajes, más intenso será el ejercicio.</li><li>Sube las dos piernas juntas hasta que vuelvan a apuntar hacia arriba.</li><li>Repite desde el paso 2.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9e34bc01-9cec-4ee2-a9bb-9c937a471c24',
  'Leg Raises, Lying',
  'abs',
  '["chest"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Lay down on a bench and hold onto the recliner with your hands to keep you stable. Hold your legs straight and lift them till they make an angle of about 45°. Make a short pause of 1 sec. and go slowly down to the initial position. To increase the intensity you can make a longer pause of 7 sec. every 5th time.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5f514f9e-6bd9-408e-85b2-c25eb04af33b',
  'Leg Raises, Standing',
  'abs',
  '["chest"]',
  'other',
  2.5,
  NULL,
  '<p>Put your forearms on the pads on the leg raise machine, the body is hanging freely. Lift now your legs with a fast movement as high as you can, make a short pause of 1sec at the top, and bring them down again. Make sure that during the exercise your body does not swing, only the legs should move.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '82aec7f9-ee03-4b24-8994-f6bde07c6a41',
  'Leverage Machine Chest Press',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Be sure to adjust seat height so that the handles are towards the bottom of your pectorals.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fd595232-b9ad-4216-bba1-92298f993ea9',
  'Leverage Machine Iso Row',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Adjust seat height so that the handles are at the bottom of your pectorals or just below.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '16089e03-5afc-4a18-a40a-beb337806ac0',
  'L Hold',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Hold the L position for as long as possible</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'de22963a-5d42-4999-860e-377f64359432',
  'Diamond push ups',
  'chest',
  '["triceps"]',
  'bodyweight',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a7e6c20a-6ddc-4401-9935-ace2d02e3995',
  'Remo con polea',
  'back',
  '["biceps"]',
  'other',
  2.5,
  NULL,
  'Siéntate, apoya los pies en los puntos de apoyo y agarra la barra con un agarre amplio. Tire de la pesa con un movimiento rápido hacia el ombligo, no hacia arriba. Durante el movimiento, mantén los brazos y los codos pegados al cuerpo. Junta los hombros. Deja que el peso baje lentamente hasta que tus brazos estén completamente estirados.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '77c98954-b50d-46f0-9912-3981f856d5a6',
  'Long-Pulley, Narrow',
  'back',
  '["biceps"]',
  'other',
  2.5,
  NULL,
  '<p>The exercise is the same as the regular long pulley, but with a narrow grip:</p>
<p>Sit down, put your feet on the supporting points and grab the bar with a wide grip. Pull the weight with a rapid movement towards your belly button, not upper. Keep your arms and elbows during the movement close to your body. Your shoulders are pulled together. Let the weight slowly down till your arms are completely stretched.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '183e7279-f052-4c70-8381-bbbda3bb9afe',
  'Low Box Squat - Wide Stance',
  'glutes',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Unrack the bar and set your stance wide, beyond your hips.  Push your hips back and sit down to a box that takes you below parallel.  Sit completely down, do not touch and go.  Then explosively stand up.  Stay tight in your upper back and torso throughout the movement.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'aa3b4ebe-6dee-45ad-a345-cf2acebf4159',
  'Lying Rotator Cuff Exercise',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>This is an excercise for problems with the levator muscles. Primary  Infraspinatus, secondary Teres Minor.</p>
<p>Lying on side. Keep elbow on waist and in 90 dgr angle. Rotate towards stomach. Add weight as fit.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7b1e458f-1857-4c2f-8463-7d67d4b2db93',
  'Press militar',
  'other',
  '[]',
  'barbell',
  2.5,
  NULL,
  'En una barra SZ, tome sus manos en el exterior de cada curva y párese con los brazos rectos hacia abajo, con las palmas hacia las piernas. Tire de la barra (doblando los brazos por el codo) hacia el pecho y empuje la barra por encima de la cabeza (los brazos lo más rectos posible). Regrese la barra a su pecho dejando caer los brazos a la altura de los codos. Regrese la barra a su posición original (párese con los brazos hacia abajo, las palmas hacia las piernas).',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0027b172-a83e-4f79-af47-483302a22c02',
  'Muscle up',
  'biceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>The body is then explosively pulled up by the arms in a radial pull-up, with greater speed than a regular pull-up. When the bar approaches the upper chest, the wrists are swiftly flexed to bring the forearms above the bar. The body is leaned forward, and the elbows are straightened by activating the triceps. The routine is considered complete when the bar is at the level of the waist and the arms are fully straight.</p>
<p>To dismount, the arms are bent at the elbow, and the body is lowered to the floor, and the exercise can be repeated.</p>
<p>As a relatively advanced exercise, muscle-ups are typically first learned with an assistive kip. The legs swing (kip) up and provide momentum to assist in the explosive upward force needed to ascend above the bar. More advanced athletes can perform a strict variation of the muscle-up which is done slowly, without any kip. This variation begins with a still dead hang and uses isometric muscle contraction to ascend above the bar in a slow, controlled fashion.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cbc5fbc9-9bca-4766-941d-4b6903d4a521',
  'Negative Crunches',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Sit yourself on the decline bench and fix your legs. Cross your arms over the chest and bring with a rolling movement your upper body up, go now without a pause and with a slow movement down again. Don''t let your head move during the exercise.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c7058ff8-ca3b-4822-abdb-6341ce37c4d1',
  'Overhand Cable Curl',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Hands at shoulder height, curl arms in toward head, then back out.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'bc45125b-58da-4ee9-8895-16a7b930b789',
  'Overhead Squat',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>The barbell is held overhead in a wide-arm snatch grip; however, it is also possible to use a closer grip if balance allows.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6441ff9e-037e-48d9-8800-67b430dc8e37',
  'Pause Bench',
  'chest',
  '["triceps"]',
  'barbell',
  2.5,
  NULL,
  '<p>Lower the bar to your chest and pause (but do not rest) there for 2 seconds. Press back up. use the same weight you would on bench press, but perform only single reps. Total the number of reps you did in one set of bench press (if you did 3 sets of 8 do 8 sinlge pause bench reps.</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '748e9635-7958-4a41-b1ed-93de74c7ef72',
  'Pendelay Rows',
  'back',
  '["biceps","triceps"]',
  'barbell',
  2.5,
  NULL,
  '<p>Back excercise with a barbell with a starting position which is in a bent over position with the back paralell to the ground. The barbell is on the ground at chest level.For the movement grab the barbell at shoulder width grip and pull towards your chest without losing the bent over position and without moving anything but your arms</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '98d73d2c-b8ee-44f4-a245-a7934adfbaef',
  'Perfect Push Up',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Push up with perfect push up</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3b96a05b-9705-48da-b43e-6e098234bb35',
  'Flexiones de pica',
  'chest',
  '["triceps"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Posición de mirada fija:</p><p>Perro mirando hacia abajo:Tu cuerpo debe hacer una forma de V, con la espalda, los brazos y las piernas rectas. Las caderas deben estar en el aire.Puedes llegar a esta posición caminando con las manos hacia atrás desde una plancha alta.</p><p>Pasos:</p><p>1.Dobla los codos hacia los lados, manteniendo la espalda y las piernas rectas y acercando la cabeza al suelo.</p><ol start="2"><li>Estira los brazos, empujando las caderas hacia atrás y manteniendo la espalda y las piernas rectas.</li><li><ol start="3"><li>Repite la operación.</li></ol></li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fe04cf35-1af5-4b51-89d4-c38d7eaa0db1',
  'Sentadillas en pistol izquierda',
  'hamstrings',
  '["shoulders","biceps"]',
  'other',
  2.5,
  NULL,
  '<ol><li>Párese en una pierna, con la otra pierna estirada y ligeramente hacia adelante.</li><li>Doble una rodilla lentamente, bajando en sentadilla y manteniendo la espalda y la otra pierna estirada.</li><li>Levántese lentamente de la sentadilla, enderezando la rodilla doblada y manteniendo la otra pierna recta.</li><li>Repita</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c9e57bbe-e839-44c6-861d-1c8dd2845e36',
  'Plancha de antebrazo',
  'abs',
  '["biceps","quadriceps","triceps"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Posición de salida:</p><ol><li>Empiece a cuatro patas.Los brazos deben estar doblados en ángulo recto, con los hombros justo sobre los codos.La espalda debe estar recta, todo el cuerpo en línea recta.</li></ol><p>Pasos:</p><ol><li>Mantenga esta posición.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dd52fb99-9426-4a78-b446-20a8e3e4ec47',
  'Preacher Curls',
  'biceps',
  '["biceps"]',
  'barbell',
  2.5,
  NULL,
  '<p> Place the EZ curl bar on the rest handles in front of the preacher bench. Lean over the bench and grab the EZ curl bar with palms up. Sit down on the preacher bench seat so your upper arms rest on top of the pad and your chest is pressed against the pad. Lower the weight until your elbows are extended and arms are straight. Bring the weights back up to the starting point by contracting biceps. Repeat</p>',
  'https://wger.de/static/images/muscles/main/muscle-13.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9cb69afc-7a44-4a22-b9a9-7bde8aca5b11',
  'Prone Scapular Retraction - Arms at Side',
  'traps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Lying on stomach with head on towel.</p>
<p>Stretch arms straight out to your sides.</p>
<p>Slowly lift your arms, pulling your shoulderblades together, hold for 3 seconds.</p>
<p> </p>',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8e420408-0682-4ab6-89f5-2681e54c7ce0',
  'Dominadas',
  'back',
  '["shoulders","biceps","traps"]',
  'bodyweight',
  2.5,
  NULL,
  'Toma la barra con los brazos a la altura de los hombros y las palmas de las manos hacia el frente. Intenta sacar el pecho, apretar el abdomen y tirar con las dorsales para elevarte hacia arriba hasta sobrepasar la barra con la barbilla intentando mantener el resto del cuerpo completamente estático',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7f834f07-fa7b-46b6-8ffa-45930b0602db',
  'Pull Ups on Machine',
  'back',
  '["shoulders","biceps","traps"]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4284336c-6cfa-4c4d-a440-26b30db035d1',
  'Push Press',
  'traps',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  '<p>Clean your dumbbells onto your shoulders, palms facing in. Take a breath and brace your core.&nbsp;(picture 1)<b>&nbsp;</b>Dip at the knees and use your legs to help&nbsp;(picture 2)&nbsp;press your dumbbells overhead. Lower under control with a slow tempo to your shoulders and repeat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5930ce9c-dfbd-452c-9949-dd34c5e41fd6',
  'Lagartijas',
  'triceps',
  '["shoulders","chest","abs"]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Acuéstese boca abajo.</li><li>Ponga sus manos cerca de sus orejas.</li><li>Usa los brazos para levantar el estómago hasta que los brazos estén rectos, manteniendo la espalda recta</li><li>Doble los brazos hasta que el pecho casi toque el suelo, asegurándose de que la espalda esté recta.</li><li>Repita desde el paso 3</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a6c2a970-a621-4e03-be1d-4a29118b1687',
  'Rack Deadlift',
  'glutes',
  '["biceps"]',
  'other',
  2.5,
  NULL,
  '<p>Deadlift to be done using a Smith machine or a free rack. Bar or barbell hould be just right under the knee cap level. Lift using the glutes and through the heels, then come back to starting postion with a control movement of 2 seconds.</p>
<p>This exercise targets mainly the lower back and glutes.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3f93459a-d06e-465c-85db-2137da759440',
  'Rear Delt Raises',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Seated on a bench bWith the dumbbells on the floor bend over at 45 Degrees and then slowly raise each dumbbell to shoulder height and hold for a couple seconds before lowering to the starting position. </p>
<p> </p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2b6c09f7-dbf1-45ea-baf6-9a12e0b12396',
  'Renegade Row',
  'back',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Get into pushup position gripping some dumbbells. Perform one pushup, then drive your left elbo up, bringing the dumbell up to your body. Return the dumbell to starting position. </p>
<p>Perform another pushup and then row with the other arm to complete one rep.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '834c639f-4c82-404d-909f-4c75275465a0',
  'Reverse Bar Curl',
  'biceps',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Hold bar with reverse (or "overhand") grip, palms facing the floor.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2cd5e3c6-a8c0-456a-ab47-5e7b3a435407',
  'Reverse Curl',
  'biceps',
  '["biceps"]',
  'barbell',
  2.5,
  NULL,
  'The reverse-grip barbell curl is a variation on the biceps curl where the palms face downward. The switch from an underhand to an overhand grip brings the forearm and brachialis muscles more into the exercise.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1b95d961-1d5c-4ded-b25e-c090295ffe37',
  'Reverse Grip Bench Press',
  'chest',
  '["shoulders"]',
  'barbell',
  2.5,
  NULL,
  '<p>Upper chest focuses exercise that also works triceps</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '09349391-375b-42d5-8979-00a5d7196a5b',
  'Reverse Plank',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Plank with stomach towards ceiling</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7671b16c-5023-4663-b00d-86dd018e024f',
  'Ring Dips',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Dips peformed on gymnastic rings.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'af2f774c-296c-4d14-8e4a-fad77175ae37',
  'Roman Chair',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Crunches on roman chair</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2e7ffff9-e603-4b28-98c8-31d1a6ce8cd9',
  'Romanian Deadlift',
  'other',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>DL from top to pos 2: https://www.youtube.com/watch?v=WtWtjViRsKo</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4b7cb037-0789-4014-ab6f-a451716b7538',
  'Row',
  'back',
  '["quadriceps"]',
  'barbell',
  2.5,
  NULL,
  'In strength training, rowing (or a row, usually preceded by a qualifying adjective — for instance a seated row) is an exercise where the purpose is to strengthen the muscles that draw the rower''s arms toward the body (latissimus dorsi) as well as those that retract the scapulae (trapezius and rhomboids) and those that support the spine (erector spinae). When done on a rowing machine, rowing also exercises muscles that extend and support the legs (quadriceps and thigh muscles). In all cases, the abdominal and lower back muscles must be used in order to support the body and prevent back injury.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '88dbcc74-0304-4fcf-8a47-92d14a484b0a',
  'Rowing, Lying on Bench',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '00fcf603-b0d0-48d2-9b5e-c7f0d510d46c',
  'Rowing, Seated',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '32c129f7-cc28-4ebc-8465-e4fa62e220b1',
  'Rowing, T-bar',
  'back',
  '["shoulders","biceps"]',
  'other',
  2.5,
  NULL,
  '<p>The execution of this exercise is very similar to the regular bent over rowing, only that the bar is fixed here.</p>
<p>Grab the barbell with a wide grip (slightly more than shoulder wide) and lean forward. Your upper body is not quite parallel to the floor, but forms a slight angle. The chest''s out during the whole exercise. Pull now the barbell with a fast movement towards your belly button, not further up. Go slowly down to the initial position. Don''t swing with your body and keep your arms next to your body.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '58416166-7a3a-470d-b493-27332799dcdf',
  'Front Wood Chop',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd9e306b6-d6ff-4e61-b283-4b085d8edaaf',
  'Bent Over Rowing Reverse',
  'back',
  '["shoulders","biceps"]',
  'barbell',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a48295d8-21da-4625-8a85-331d7ced8d8b',
  'Run',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Running or jogging outside in a park, on the tracks,...</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6cf55ecc-86ee-492d-a7f6-977bf61758b3',
  'Run - Interval Training',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Run and do some interval trainings such as hill repat, fartlek,..</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '654793c2-e0e3-41fd-a549-0ece0f4378e8',
  'Run - Treadmill',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Run on a treadmill</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '57e17672-52b9-43cf-8d0d-4b3f06a0c0d0',
  'Incline Bench Press - Dumbbell',
  'chest',
  '["shoulders","triceps"]',
  'dumbbell',
  2.5,
  NULL,
  '<ul>
<li>Bench should be angled anywhere from 30 to 45 degrees</li>
<li>Be sure to press dumbbells straight upward (perpendicular to the floor)</li>
</ul>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '275fb49f-975c-4d6e-9d63-2c86ed740f40',
  'Press de banca inclinado',
  'chest',
  '["shoulders","triceps"]',
  'barbell',
  2.5,
  NULL,
  'Press de banca inclinado con barra fija.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '60e9a0c0-5458-46cd-ab41-7d7b85225cf8',
  'Incline Bench Press - MP',
  'chest',
  '["shoulders","triceps"]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5912d7ed-6a0e-4b4c-b30a-fc9f3f890fc1',
  'Shoulder Press, on Machine',
  'shoulders',
  '["triceps"]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e28b0685-7a8f-4343-9c0b-63b38386d30b',
  'Scissors',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Scissors is an abdominal exercise that strengthens the transverse abdominals, helping flatten your belly and strengthen your entire core. Scissors is not only a core strength move, but it is also a great stretch for your hamstrings and your lower back. Everyone is looking for new ways to work the core, to flatten the belly and to improve flexibility. If you learn how to do Scissors you will get everything rolled together in one move.</p>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cc5bf1a3-29b5-4c5a-8600-5e35c79ab4bf',
  'Press de tríceps sentado',
  'triceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Siéntese boca arriba (mejor con respaldo). Tome una mancuerna firmemente con ambas manos y sosténgala con los brazos extendidos sobre su cabeza. Con las palmas de las manos hacia arriba y sosteniendo el peso de la mancuerna, baje lentamente el peso detrás de la cabeza.',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '919bb48a-42fe-4a11-9078-ea2b5087c49f',
  'Side Bends on Machine',
  'abs',
  '["abs"]',
  'dumbbell',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '169896b2-90e3-4497-9d73-56bee4a34697',
  'Shotgun Row',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '<ol>
<li>Attach a single handle to a low cable.</li>
<li>After selecting the correct weight, stand a couple feet back with a wide-split stance. Your arm should be extended and your shoulder forward. This will be your starting position.</li>
<li>Perform the movement by retracting the shoulder and flexing the elbow. As you pull, supinate the wrist, turning the palm upward as you go.</li>
<li>After a brief pause, return to the starting position.</li>
</ol>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8b0a0371-c0a9-42a7-aab7-68d520542fb2',
  'Shoulder Press, Barbell',
  'shoulders',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Sit on a bench, the back rest should be almost vertical. Take a barbell with a shoulder wide grip and bring it up to chest height. Press the weight up, but don''t stretch the arms completely. Go slowly down and repeat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '87affa4b-395b-437c-9581-2bd20ea5aa7c',
  'Shoulder Press, Dumbbells',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Sit on a bench, the back rest should be almost vertical. Take two dumbbells and bring them up to shoulder height, the palms and the elbows point during the whole exercise to the front. Press the weights up, at the highest point they come very near but don''t touch. Go slowly down and repeat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '141bc870-56be-4749-a3b9-e56d5d5618b4',
  'Shoulder Press, on Multi Press',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>The exercise is basically the same as with a free barbell:</p>
<p>Sit on a bench, the back rest should be almost vertical. Take a bar with a shoulder wide grip and bring it down to chest height. Press the weight up, but don''t stretch the arms completely. Go slowly down and repeat.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f956977e-cc05-4db2-a387-ba6140b1ef34',
  'Shoulder Shrug',
  'traps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'The shoulder shrug (usually called simply the shrug) is an exercise in weight training used to develop the upper trapezius muscle. The lifter stands erect, hands about shoulder width apart, and raises the shoulders as high as possible, and then lowers them, while not bending the elbows, or moving the body at all. The lifter may not have as large a range of motion as in a normal shrug done for active flexibility. It is usually considered good form if the slope of the shoulders is horizontal in the elevated position.',
  'https://wger.de/static/images/muscles/main/muscle-9.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '270e108d-3cd2-45a9-807b-c357317eb15c',
  'Shrugs, Barbells',
  'shoulders',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Take a barbell and stand with a straight body, the arms are hanging freely in front of you. Lift from this position the shoulders as high as you can, but don''t bend the arms during the movement. On the highest point, make a short pause of 1 or 2 seconds before returning slowly to the initial position.</p>
<p>When training with a higher weight, make sure that you still do the whole movement!</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '72a945ec-3a7f-424b-9a05-1616ef7dce91',
  'Shrugs, Dumbbells',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Stand with straight body, the hands are hanging freely on the side and hold each a dumbbell. Lift from this position the shoulders as high as you can, but don''t bend the arms during the movement. On the highest point, make a short pause of 1 or 2 seconds before returning slowly to the initial position.</p>
<p>When training with a higher weight, make sure that you still do the whole movement!</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6199b3c7-3ccb-47fa-89bb-ef7fef12c0e3',
  'Shrugs on Multipress',
  'shoulders',
  '["triceps"]',
  'other',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2f8ee51b-f493-47f7-8b2a-1da16c128f73',
  'Side Crunch',
  'abs',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Hold weight in one hand. Bend side ways to the knee. Pull upo to upright position using your obliquus.</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cf1f0fed-6310-4210-8f7d-22e375e6c60c',
  'Side Dumbbell Trunk Flexion',
  'abs',
  '["abs"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>AKA dumbbell side bends. Stand in line with the hips with slightly bent knees, maintain the natural curvature of the spine, hand stretched by the body, grip the barbell with one hand. <em> </em>Make slow and controlled torso side flexions till you reach the angle of approximately 45°.</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd9f6c15a-b224-4ef6-93e9-fd6509b66add',
  'Side-lying External Rotation',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>With a weight in one hand, lie on your side opposite the weight. Keep your knees slightly bent. Hold your elbow against your side, and extend your upper arm straight ahead of you. While continuing to hold your elbow against your side, rotate your upper arm 90 degrees upwards.</p>
<p>It is helpful to place a towel under your armpit to help with the form on this exercise. Placing a support under your head for the duration of the exercise is also a good idea.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e1b99153-0102-47fc-b0cd-c21509827b0b',
  'Plancha de lado izquierdo',
  'abs',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Acuéstese sobre su lado correspondiente, con el codo en ángulo recto y el brazo hacia afuera</li><li>Levante la pelvis del suelo levantando el hombro hacia arriba, manteniendo el antebrazo en el suelo; la cabeza, la pelvis y los pies deben estar en línea recta</li><li>Mantenga esta posición</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9374fdaf-411f-4ae6-8f0c-21cc2d3dc667',
  'Side to Side Push Ups',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>-start in push up position</p>
<p>-lean the body weight to the right side, and complete a push up with the chest over the right hand</p>
<p>-come back to the centered position</p>
<p>-on rep 2, lean to the left side</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c85e6137-2577-4e28-82c2-427407d534eb',
  'Single-arm Preacher Curl',
  'biceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Sit on the preacher curl bench and perform a bicep curl with a dumbbell in one hand. Your other hand can be at rest, or beneath your curling arm''s elbow.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6e46833d-fd83-4c1a-90af-eb3f3a917199',
  'Sitting Calf Raises',
  'calves',
  '["calves"]',
  'other',
  2.5,
  NULL,
  '<p>Sit on a bench for calf raises and check that the feet are half free and that you can completely stretch the calf muscles down. Pull your calves up, going as far (up) as you can. Make at the highest point a short pause of 1 or 2 seconds and go down.</p>',
  'https://wger.de/static/images/muscles/main/muscle-15.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f38e9c23-031d-44d0-ac27-7f1026212c73',
  'Abdominales',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  'Siéntese en una colchoneta, sus pantorrillas descansan en un banco, las rodillas forman un ángulo recto. Mantenga sus manos detrás de su cuello. Sube ahora con un movimiento de balanceo de tu espalda, debes sentir cómo las vértebras individuales pierden contacto con la colchoneta. En el punto más alto, contrae los abdominales tanto como puedas y mantenlos allí durante 2 segundos. Baja ahora, desenrollando tu espalda.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e60125f0-3a88-4707-815f-fe0e2b4be3c4',
  'Skipping - Standard',
  'calves',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Do a single, double footed jump for each swing of the rope.</p>
<p>Work on a smooth, rhythmical movement, bouncing lightly on the balls of your feet.</p>',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '092d0fbb-0409-470e-a087-beb9a378f3f7',
  'Smith Machine Close-grip Bench Press',
  'triceps',
  '["chest"]',
  'other',
  2.5,
  NULL,
  '<p>Perform a standard bench press on the smith machine, but have your hands on the bar about shoulder width apart, and keep your elbows close to your body.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8161de8b-7802-46c0-9bd4-db60f39b7677',
  'Snach',
  'shoulders',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Stand with your feet at hip width and your shins against the bar. Grasp the bar at double shoulder width and, keeping your lower back flat, drive your heels into the floor to begin lifting the bar. When it''s above your knees, explosively extend your hips and shrug your shoulders. Let the momentum carry the weight overhead.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b1051c3e-78a9-4b73-899c-c700098cf1a8',
  'Speed Deadlift',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Deadlift with short (less than one 1min) rest between sets.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'eaf6f39e-d46d-4460-b5a9-71e814b18f89',
  'Splinter Sit-ups',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Lie on your back with your legs straight and arms at your sides, keeping your elbows bent at 90 degrees. As you sit up, twist your upper body to the left and bring your left knee toward your right elbow while you swing your left arm back. Lower your body to the starting position, and repeat to your right. That''s 1 rep.</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5c0824dc-f2fb-4d19-a1e5-7c33219ad51d',
  'Squat Jumps',
  'quadriceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Jump wide, then close</p>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a2f5b6ef-b780-49c0-8d96-fdaff23e27ce',
  'Sentadillas',
  'quadriceps',
  '["glutes"]',
  'barbell',
  2.5,
  NULL,
  '<ol><li>Levántese con los pies separados al ancho de hombros</li><li>Mueva las caderas hacia atrás y doble las rodillas y caderas para bajar el torso</li><li>Repita</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '30ac081b-fb79-4253-9457-8efc07568790',
  'Squat Thrust',
  'glutes',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'The burpee, or squat thrust, is a full body exercise used in strength training and as an aerobic exercise. The basic movement is performed in four steps and known as a four-count burpee: Begin in a standing position. Move into a squat position with your hands on the ground. (count 1) Kick your feet back into a plank position, while keeping your arms extended. (count 2) Immediately return your feet into squat position. (count 3) Stand up from the squat position (count 4)',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'eb61c7a1-e1c9-4c44-a8ce-2bbe98a39857',
  'Standing Bicep Curl',
  'biceps',
  '["biceps"]',
  'dumbbell',
  2.5,
  NULL,
  'Stand holding dumbbells at shoulder width apart. Face forearm upward and keep upper arm still while raising each dumbbell up to your shoulder.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7ce443b6-eb84-4f65-b05f-461c1cc8bcc0',
  'Standing Calf Raises',
  'calves',
  '["calves"]',
  'other',
  2.5,
  NULL,
  '<p>Get onto the calf raises machine, you should able to completely push your calves down. Stand straight, don''t make a hollow back and don''t bend your legs. Pull yourself up as high as you can. Make a small pause of 1 - 2 seconds and go slowly down.</p>',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7dc59fa0-5552-4ffa-954f-9bc8c22740bf',
  'Standing Rope Forearm',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Grab a wrist roller tool with both hands while standing with your feet about shoulder width apart. If your gym does not have a wrist roller tool, you can easily put one together. All you need is a 5 or 10 pound weight plate, a strong thin rope about 3 feet long and a 6-8 inch stick or bar. Securely fasten the rope to the middle of the bar/stick and tie the other end of the rope to the weight plate. To begin this exercise, grab the bar/stick with both hands using an overhand grip. Extend both arms straight out in front of you, parallel to the floor. Next, roll the weight up from the floor by rapidly twisting the bar/stick with your hands and wrists. Once the weight reaches the top, slowly lower the plate back to the floor by reversing the motion of your hands and wrists. Repeat (if you can!).</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4d5decb3-5fbe-45c1-9ad5-ff715e53cb34',
  'Stationary Bike',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Ride a Stationary Bike with various tensions.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '22c59ede-970b-43e1-bb51-ac1c2be0b0e0',
  'Stiff-legged Deadlifts',
  'hamstrings',
  '["glutes"]',
  'barbell',
  2.5,
  NULL,
  '<ul>
<li>Keep legs straight</li>
<li>Keep back straight</li>
</ul>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0f5fc602-afb6-4500-87da-f115f3ef3f47',
  'Straight-arm Pull Down (bar Attachment)',
  'back',
  '["triceps"]',
  'other',
  2.5,
  NULL,
  '<p>Use the straight bar attachment on a high pulley. Grasp the two ends of the bar with your palms facing downward and your arms straight out in front of you. Pull your hands down towards your hips, while keeping your arms straight, then raise them back up to the starting position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2f7149c3-77ce-4313-a59c-aef82b5a730a',
  'Straight-arm Pull Down (rope Attachment)',
  'back',
  '["triceps"]',
  'other',
  2.5,
  NULL,
  '<p>Use the rope attachment on a high pulley. Grasp the two ends of the rope with your arms straight out in front of you. Pull your hands down towards your hips, while keeping your arms straight, then raise them back up to the starting position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0c2d9b74-3d1e-481f-a7bf-3b3532f7d6b0',
  'Sumo Deadlift',
  'quadriceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<ol>
<li>Begin with a bar loaded on the ground. Approach the bar so that the bar intersects the middle of the feet. The feet should be set very wide, near the collars. Bend at the hips to grip the bar. The arms should be directly below the shoulders, inside the legs, and you can use a pronated grip, a mixed grip, or hook grip. Relax the shoulders, which in effect lengthens your arms.</li>
<li>Take a breath, and then lower your hips, looking forward with your head with your chest up. Drive through the floor, spreading your feet apart, with your weight on the back half of your feet. Extend through the hips and knees.</li>
<li>As the bar passes through the knees, lean back and drive the hips into the bar, pulling your shoulder blades together.</li>
<li>Return the weight to the ground by bending at the hips and controlling the weight on the way down.</li>
</ol>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0a5a7661-1e24-4c15-bb2b-503672141307',
  'Sumo Squats',
  'glutes',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Stand with your feet wider than your shoulders, with your toes pointed out at a 45 degree angle and barbell on your shoulder.</p>
<p>While keeping your back straight, descend slowly by bending at the knees and hips as if you are sitting down (squatting).</p>
<p>Lower yourself until your quadriceps and hamstrings are parallel to the floor.</p>
<p>Return to the starting position by pressing upwards and extending your legs while maintaining an equal distribution of weight on your forefoot and heel.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '66c90ca7-23d8-47b1-820f-dc0c8140603b',
  'Superman',
  'glutes',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Lay flat on your stomach with your arms extended in front of you on the ground as your legs are lying flat. Lift both your arms and legs at the same time, as if you were flying, and contract the lower back. Make sure that you are breathing and, depending on your fitness level, hold the movement for at least two to five seconds per repetition.</p>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '51420ded-5c17-4ce0-b005-89f1b67b7c65',
  'Thruster',
  'shoulders',
  '["traps"]',
  'barbell',
  2.5,
  NULL,
  '<ol>
<li>Start by doing a front squat</li>
<li>At the top position, push the bar above your head (similar to a press)</li>
<li>Lower the bar to the shoulders</li>
</ol>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5915fabe-c941-4dac-b196-bc4e8c7ce57b',
  'Contragolpe de tríceps con mancuernas',
  'triceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Comience con una mancuerna en cada mano y las palmas de las manos hacia el torso. Mantenga la espalda recta con una ligera flexión de las rodillas e inclínese hacia adelante por la cintura. Tu torso debe estar casi paralelo al piso. Asegúrate de mantener la cabeza en alto. Tus brazos superiores deben estar cerca de tu torso y paralelos al piso. Tus antebrazos deben apuntar hacia el suelo mientras sostienes las pesas. Debe haber un ángulo de 90 grados formado entre el antebrazo y la parte superior del brazo. Esta es tu posición de inicio. Ahora, mientras mantiene la parte superior de sus brazos inmóviles, exhale y use sus tríceps para levantar las pesas hasta que el brazo esté completamente extendido. Concéntrese en mover el antebrazo. Después de una breve pausa en la contracción superior, inhala y baja lentamente las mancuernas hasta la posición inicial. Repita el movimiento la cantidad prescrita de repeticiones. Variaciones: este ejercicio también se puede ejecutar con un brazo a la vez, al igual que se realizan las filas de un brazo. Además, si le gusta la variedad de un solo brazo, puede usar un mango de polea baja en lugar de una mancuerna para una mejor contracción máxima. En este caso, las palmas deben estar hacia arriba (agarre en supinación) en lugar del torso (agarre neutral).',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3188868c-84e2-4a3b-b7dc-f79d8650988d',
  'Extension de triceps polea',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  'Coge el cable, párate con los pies a la altura de los hombros, mantén la espalda recta e inclínate un poco hacia delante. Empuje la barra hacia abajo, asegurándose de que los codos no se muevan durante el ejercicio. Gire las manos hacia afuera al final y vuelva a la posición inicial sin pausa.',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f00630d6-578f-487f-8bf5-39c96366ccb8',
  'Triceps Extensions on Cable With Bar',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Grab the bar, stand with your feet shoulder wide, keep your back straight and lean forward a little. Push the bar down, making sure the elbows don''t move during the exercise. Without pause go back to the initial position.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6c671e43-497f-4863-8d78-b592f3b5e7c6',
  'Triceps Machine',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>.</p>',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '90e9f590-7d68-4afb-9f95-8429246ea4aa',
  'Trunk Rotation With Cable',
  'abs',
  '["back"]',
  'other',
  2.5,
  NULL,
  '<p>Seated trunk rotation with cable </p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8766d43c-e035-4c37-b824-b94dce5bf710',
  'Rowing with TRX band',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  NULL,
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '309bfd2b-1af4-49db-b64b-d7d7c7dd39bb',
  'Turkish Get-Up',
  'shoulders',
  '["shoulders","glutes","abs","chest"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Starting on back, move to the standing position with dumbbell in one hand.  Switch hands between reps.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '52dec48d-25a4-4a78-b66b-ad6a773e143a',
  'Power Clean',
  'chest',
  '[]',
  'barbell',
  2.5,
  NULL,
  '<p>Olympic weight lifting</p>',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '76965848-9776-4be5-b879-e3c97033b80f',
  'Underhand Lat Pull Down',
  'back',
  '["biceps"]',
  'other',
  2.5,
  NULL,
  '<p>Grip the pull-down bar with your palms facing you and your hands closer than shoulder-width apart. Lean back slightly and keep your back straight. Pull the bar down towards your chest, pulling your shoulders back slightly at the end of the motion.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f4467e9a-9bb1-4e93-bec6-10a5d7738ffb',
  'Overhead Press',
  'shoulders',
  '[]',
  'barbell',
  2.5,
  NULL,
  NULL,
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6fc4815a-8852-4e89-a10b-bd36a9029dbb',
  'Upper External Oblique',
  'abs',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Exercise for upper external oblique muscles</p>',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '738137c0-5387-4215-b457-ea7af113b3ba',
  'Upright Row, on Multi Press',
  'shoulders',
  '["biceps"]',
  'other',
  2.5,
  NULL,
  '<p>The movements are basically the same as with an SZ-bar, but you use the bar on the multi press:</p>
<p>Stand straight, your feet are shoulder-width apart. Hold the bar with an overhand grip on your thighs, the arms are stretched. Lift the bar close to the body till your chin. The elbows point out so that at the highest point they form a V. Make here a short pause before going slowly down and repeating the movement.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5d40c67d-be59-4092-9c9c-301ca5310e2b',
  'Upright Row, SZ-bar',
  'shoulders',
  '["biceps"]',
  'barbell',
  2.5,
  NULL,
  '<p>Stand straight, your feet are shoulder-width apart. Hold the SZ-bar with an overhand grip on your thighs, the arms are stretched. Lift the bar close to the body till your chin. The elbows point out so that at the highest point they form a V. Make here a short pause before going slowly down and repeating the movement.</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '01976085-6701-45ea-b152-5c46ba60550d',
  'Upright Row w/ Dumbbells',
  'shoulders',
  '["biceps"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Feet apart at shoulder width. Nice and Slow!</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd847301e-1613-4987-85cd-61d3ff9d7ef8',
  'V-Bar Pulldown',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Pulldowns using close grip v-bar.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4e752292-051a-4043-8f80-a390c23875e6',
  'Elevación de pantorrilla izquierda',
  'calves',
  '[]',
  'other',
  2.5,
  NULL,
  '<ol><li>Párese en el suelo o en el borde de un escalón para aumentar el rango de movimiento. Levante un pie, colocando la parte superior de su pantorrilla</li><li>Levante los talones hasta que esté de pie</li><li>Manténgase en esta posición durante tres segundos, luego baje el pie sin tocar el suelo con el talón.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0d68029a-f025-41fe-9c56-6ccbc32bc43d',
  'Flexión a pino contra la pared',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Flexiones a pino contra ma pared (pecho cara a la pared). Progresión de las flexiones a pino. Ideal para ganar fuerza en deltoides',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '51a80676-92d8-4f91-b51a-4666888e40db',
  'Wall Pushup',
  'shoulders',
  '["glutes","abs","chest","traps"]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Pushup against a wall</p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f1946fd4-793d-47a5-b66f-599b7f53695d',
  'Wall Slides',
  'biceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Stand with heels, shoulders, back of head, and hips touching the wall. Start with biceps straight out and elbows at a 90 degree angle. Straighten the arms while remaining againstthe wall without arching the back off of the wall, mimicking a shoulder press movement. </p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '46ee5805-512a-43a2-944c-97f7744b0078',
  'Asiento en pared',
  'hamstrings',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Apóyese en la pared, mirando hacia adelante y con los pies plantados firmemente en el suelo, sus hombros deben separarse y estar a 50 centímetros de la pared</li><li>Deslízate por la pared, manteniendo la espalda presionada a ella, hasta que las piernas estén en ángulo recto. Las rodillas deben estar directamente sobre los tobillosEl dolor en el cuádriceps es normal, deténgase si siente dolor en la rodilla o en la rótula</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '591992cb-48ee-4b39-b790-e05b4a2c11e3',
  'Weighted Step-ups',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>box step ups w/ barbell and 45''s on each side</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '55b9d286-c4cc-4a29-97ad-58cb13c2bb7e',
  'Wide-grip Pulldown',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '<p>Lat pulldowns with a wide grip on the bar.</p>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '68e5eae7-7fd0-4d69-9b50-d0df15feac91',
  'Dumbbell Push-Up',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Normal Push-ups on Dumbbells, this brings a further range of movement</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '072a9fa8-1028-47b3-b958-d8052c6b8661',
  'Barbell Lunges Walking',
  'other',
  '[]',
  'barbell',
  2.5,
  NULL,
  NULL,
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f8d69dd4-3c35-49c7-8cbe-f0132eca4c52',
  'One Arm Triceps Extensions on Cable',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  NULL,
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9f9edad8-7da0-448c-bfcb-ec61f2d28162',
  'Sloper hanging',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Hanging on sloper holds of a fingerboard for a amount of seconds</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ea63d85c-8579-4dda-b99f-c4c8930f9af6',
  'Empuje de tríceps en cable',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  'El empuje hacia abajo de la cuerda del cable es un ejercicio popular dirigido a los músculos tríceps. Es fácil de aprender y realizar, lo que lo convierte en el favorito de todos, desde principiantes hasta levantadores avanzados. Por lo general, se realiza para repeticiones de moderadas a altas, como 8-12 repeticiones o más por serie, como parte de un entrenamiento centrado en la parte superior del cuerpo o en los brazos.',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0ecd5f3a-f156-4f1b-b29e-16fb80802a50',
  'Fingerboard 20 mm edge',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Hang for 10 seconds on a fingerboard with a 20 mm edge',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a540925e-fe66-47cc-ae28-ecdce408fb6d',
  'Pullup on fingerboard',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Pullup on a choosen edge of a fingerboard / hangboard ',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5d244235-cd56-472a-876e-6e530a899ef2',
  'Cable Rear Delt Fly',
  'shoulders',
  '["triceps"]',
  'other',
  2.5,
  NULL,
  '<p style="">The reverse cable fly, also known as the cable rear delt fly, is a deltoid muscle strengthening and definition exercise. It’s one of the best isolation exercises for your back and posterior deltoid.This workout targets your posterior (back) deltoids while using a range of upper body muscles.</p><p style=""></p><ol><li>Adjust the weight and the pulleys to the right height. You should be able to see the pulleys because they should be above your head.</li><li>With your right hand, grab the left pulley, and with your left hand, grab the right pulley, crossing them in front of you. This is where you’ll begin your journey.</li><li>Start the movement by moving your arms back and forth while keeping your arms straight.</li><li>Pause at the finish of the move for a brief moment before returning the handles to their starting positions.</li></ol><p></p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd3b21677-7311-40f8-a321-0ad4f7dfc3a9',
  'Front Plate Raise',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  'The plate front raise is a variation of the dumbbell front raise where the lifter holds a weight plate between two hands, rather than using a dumbbell, barbell, or other weight. It can provide variety in a shoulder-focused muscle-building workout, or as part of an upper body or full-body circuit.
<ol><li>While standing straight, hold a barbell plate in both hands at the 3 and 9 o''clock positions. Your palms should be facing each other and your arms should be extended and locked with a slight bend at the elbows and the plate should be down near your waist in front of you as far as you can go. <b>Tip</b>: The arms will remain in this position throughout the exercise. This will be your starting position.</li><li>Slowly raise the plate as you exhale until it is a little above shoulder level. Hold the contraction for a second. As you inhale, slowly lower the plate back down to the starting position.</li><li>Repeat for the recommended amount of repetitions.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '70c99a4e-3340-4993-a7f1-2d2709dada1a',
  'Incline Bench Reverse Fly',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'The incline dumbbell reverse fly is an upper-body exercise targeting the posterior or rear deltoids, as well as the postural muscles of the upper back. Because it targets such small muscles, this exercise is usually performed with light weight for high reps, such as 10-15 reps per set or more.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dc400220-b483-4b60-8f52-c36c70a782b5',
  'Rear Delt Raise',
  'shoulders',
  '["back"]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Seated on a bench with the dumbbells on the floor bend over at 45 Degrees and then slowly raise each dumbbell to shoulder height and hold for a couple seconds before lowering to the starting position.&nbsp;</p><p></p>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fb0c8c53-27ec-4aac-ab6e-403b7d7f250b',
  'Squat con barra',
  'quadriceps',
  '["hamstrings"]',
  'barbell',
  2.5,
  NULL,
  'Controla la bajada, baja en 2 segundos y sube lo más explosivo que puedas.
Es muy importante que hagas movilidad de cadera antes de empezar a entrenar, para mejorar la profundidad.
Olvidate del peso, baja todo lo que puedas, sin levantar los talones del suelo y sube par arriba.
Una buena técnica va a generarte más hipertrofia que mucho peso sin un ROM correcto.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0b84816e-3d11-47f0-a043-2a3f20504a48',
  'Extensión de cuádriceps',
  'quadriceps',
  '["hamstrings"]',
  'other',
  2.5,
  NULL,
  'Es un ejercicio de aislamiento centrado en los cuádriceps, que están formados por cuatro músculos específicos de la parte anterior del muslo: el recto femoral, el vasto lateral, el vasto medio y el vasto intermedio.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7b6460b2-49d2-40b0-a4f6-4780c79f7e25',
  'Barbell Hip Thrust',
  'glutes',
  '[]',
  'barbell',
  2.5,
  NULL,
  'Sit on the ground with a bench behind you, bending your knees so your feet are planted on the ground and holding a barbell resting below your hips. If you have a padded bar, or anything you can slip in between the bar and your body, it will go a long way to making the exercise more comfortable.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '50edc0f5-e9d0-471c-9fd7-fd691162b447',
  'Barbell Hip Thrust',
  'glutes',
  '[]',
  'barbell',
  2.5,
  NULL,
  'Sit on the ground with a bench behind you, bending your knees so your feet are planted on the ground and holding a barbell resting below your hips. If you have a padded bar, or anything you can slip in between the bar and your body, it will go a long way to making the exercise more comfortable.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'af0be7c9-2b9d-47fd-abee-84edd8207b9b',
  'Barbell Hip Thrust',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Sit on the ground with a bench behind you, bending your knees so your feet are planted on the ground and holding a barbell resting below your hips. If you have a padded bar, or anything you can slip in between the bar and your body, it will go a long way to making the exercise more comfortable.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ed00a43f-f761-41f2-94d4-056120bc5f6d',
  'Flexiones a pino',
  'shoulders',
  '["chest"]',
  'other',
  2.5,
  NULL,
  'Flexiones mientras se hace el pino. Requiere mucha habilidad y fuerza',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '89c3d614-e841-4c04-bee8-6761567e4b7c',
  'Zone 2 Running',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Zone two Cardio for endurance, you should be able to speak while running',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6cbdd70c-0691-4288-b58a-24001384f1b3',
  'Reverse Nordic Curl',
  'quadriceps',
  '["glutes","abs"]',
  'other',
  2.5,
  NULL,
  'Natural Leg Extension is alternative to Leg Extension machine with no equipment.&nbsp;&nbsp;',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9b0f7101-b78a-4c47-b680-fbef15469a8a',
  'Nordic Curl',
  'hamstrings',
  '["glutes"]',
  'other',
  2.5,
  NULL,
  '<p style="">The Nordic hamstring curl is one of the best lower-body exercises to&nbsp;build posterior leg strength, improve knee health, and prevent injury.</p>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '76a2f8a6-374b-42c8-b8ac-e8d64612f046',
  'Incline Skull Crush',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  'Siting in a 45 Degree Angle, using DB to do Incline Skull Crush',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '36274d27-3812-4b8c-80e2-ab59acf82c4d',
  'Straight Bar Cable Curls',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  'Standing upright in front of Cable Tower using a straight bar',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'edc44b1a-35d7-4c37-ab20-05842fb40576',
  'Curl de predicador inverso',
  'biceps',
  '[]',
  'barbell',
  2.5,
  NULL,
  'Sentado al revés en un banco de bíceps con un agarre estrecho',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '960697af-9a0e-4bfd-a8ba-989718b6b5c7',
  'Reverse EZ Bar Cable Curls',
  'biceps',
  '[]',
  'barbell',
  2.5,
  NULL,
  'Standing in front of cable tower using a SZ Bar',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3d85bdce-e1a9-48a2-b14d-8032820ebf25',
  'BUS DRIVERS',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  'Sitting with a Weight Plate, used as wheel, in both hands; raised slightly below eye level',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cbf4cf16-f188-4a60-a223-aa50b163f4b7',
  'Smith Press',
  'shoulders',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Sitting almost 90 degree angle, smith machine&nbsp;',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ca16aa3c-9b43-4d81-ae60-1e225163b767',
  'Elevación frontal con cable',
  'shoulders',
  '[]',
  'barbell',
  2.5,
  NULL,
  'olver a torre de cable, cable entre patas, barra SZ',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6d010eae-2e36-4ec6-b191-c0373f237bb4',
  'Seated Dumbbell Side Lateral',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'seated slightly leaned forward at beginning of exercise',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1eeccede-29c5-4f38-9ba7-d77c7c47993d',
  'T-Bar row',
  'back',
  '[]',
  'barbell',
  2.5,
  NULL,
  'bent over with triangle grip, slightly bent knees',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '887fea99-352d-45ff-8e06-ef95eaa37902',
  'V-BAR PULL DOWNS',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Cable machine, leaned forward during negative, lean back during contraction',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd6e9ed59-497a-4c93-ac7d-f9696fcd21ab',
  'Tirar de cables sentados',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Manténgase inclinado hacia adelante, meta los codos en el lado negativo',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ad3716b1-5fc9-45aa-9de4-9a1c0153915d',
  'SEATED CABLE MID TRAP SHRUG',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'seated straight back, slight hold at top',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dab7400b-e86e-4224-bcea-4a915dc928e0',
  'LYING DUMBBELL ROW SS SEATED SHRUG',
  'back',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'laying on the stomach on a bench with slight angle',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '40d35363-0579-4f0f-aac6-a32a6de3f08a',
  'Cable Fly',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  'cable machine, two steps forward, straight back',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ef2df6a2-41df-4a25-b2e0-4808dc2c3305',
  'SMITH MACHINE SLIGHT INCLINE PRESS',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  'laying under smith machine, with slight incline',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1e827ef8-0a01-4b26-9e26-eff9d200acca',
  'Machine chest fly',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  'seated machine, straight back, slow exercise',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e0d9e9ef-09ee-4d26-9504-622093810414',
  'Suspended crossess',
  'chest',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Suspension exercise with trx for chest training',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '80c167b9-3749-48a1-8686-fc2163a1e7fb',
  'Quadriped Arm and Leg Raise',
  'shoulders',
  '["back"]',
  'bodyweight',
  2.5,
  NULL,
  'In this exercise, the back muscles and the muscles of the back of the leg and back of the arm are activated by lifting the crossed arm and leg at the same time in the crawling position. It also improves balance and proprioception. The movement is done symmetrically.

1. Get into a crawling posture.2. Draw your abdomen in, then raise your right leg and left arm.3. You should keep your abdomen in for 8 seconds.4. After 8 seconds, slowly lower your arm and leg.5. Then release your muscle.
',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '596b9d2d-0f01-41a0-97e1-1839ffdb824d',
  'Biceps con TRX',
  'biceps',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'músculos implicados: bíceps Agarre las asas de las correas TRX, incline el cuerpo hacia atrás, brazos y piernas extendidos, cuerpo posicionado en una sola línea. (no es de abdominales, es de brazos)',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e2599e86-d8b0-434e-8a48-aa3c2df7e790',
  'Trazioni orizzontali al trx',
  'shoulders',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'È l''esercizio propedeutico dei Pull Up. I muscoli che vengono coinvolti in questo esercizio di tirata sono il&nbsp;<b style="">gran dorsale, deltoide e bicipiti</b>.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd813ef7c-b10a-4c5c-ba55-6b9518e7ff4c',
  'kettlebell swing',
  'shoulders',
  '["quadriceps","abs","traps"]',
  'dumbbell',
  2.5,
  NULL,
  'While kettlebell swings are a full-body workout, they mostly target the muscles along the posterior chain (back of the body). The main muscles used are the glutes, hamstrings, spinal erectors, and muscles of the upper back.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6c8b0c67-68af-4473-907e-31fb1e48430c',
  'Swimming 50m sprints',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '50m swimming sprints at 1min',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '95a300de-2ad8-492e-9364-13766d9e7618',
  'Elliptical',
  'glutes',
  '["biceps","abs","triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'It improves muscle toning, strengthens the leg muscles (quads, glutes, calves), helps vascularisation and increases resistance. The elliptical is also very useful if you aim to lose weight.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3de523ee-d359-4044-a792-6de22eef0495',
  'Curl with kettlebell two hands',
  'biceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Stand upright and grip the kettlebell with both hands. Perform the elbow flexion motion, starting from a fully extended position until your hand reaches shoulder height. Spread your legs a little for stability and, to perform the exercise correctly, try not to push with your back or body in general. Change the weight of the kettlebell to adjust the difficulty.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd7d4fc16-08cd-4568-87e7-d9e4e2f77393',
  'one-handed kettlebell curls',
  'biceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Standing with the kettlebell in one hand and bent at the elbow, start from a fully extended position until your hand reaches shoulder height. To perform the movement correctly, try not to push with your back or body.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '346634cf-3896-4c10-bd66-28fb69d02573',
  'Medicine ball booklet crunch',
  'abs',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Using a medicine ball as an overload will make the exercise heavier.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '151434a5-c046-459f-a3a9-c3125075856f',
  'Squat box',
  'glutes',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'improvements in coordination, balance and endurance, toning of the leg and buttock muscles and an overall increase in bone density eliminating the risk of osteoporosis.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f4991a98-6422-4884-8ad3-43412f91fac1',
  'Elevaciones de rodillas',
  'abs',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  'La elevación de piernas a 90° en la barra es un ejercicio muy intenso en el que intervienen todos los músculos abdominales.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b2025776-2397-4de7-a49e-296321169481',
  'Leg raises pull up bar',
  'abs',
  '["abs","quadriceps"]',
  'bodyweight',
  2.5,
  NULL,
  'with a firm grip with both hands on the bar, raise your outstretched legs, until you reach a 90° angle with your torso.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e872658a-3bac-4d9e-bcf2-15919ebea43a',
  'commando pull-ups',
  'shoulders',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'variation of the pull-up exercise, it is performed with a grip of one hand supine and one hand prone,&nbsp;do not twist the torso to get back to the front, the head passes once to one side, once to the other.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9e6dae29-5d03-440a-bdf1-2cb25a5179c2',
  'Subida a peldaño',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Párese frente a una silla</li><li>Súbase a la silla</li><li>Bájese de la silla</li><li>Repita</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'db5bd076-2f1d-4b72-9be9-610e5c3f5724',
  'Rodillas elevadas',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Trote en el lugar, con las rodillas tan altas como pueda y cambie de pierna a un ritmo rápido</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3284fd27-5402-4821-9c32-29066d4e2667',
  'Zancadas con peso',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Párese con la espalda recta</li><li>Dé un gran paso adelante con su pierna izquierda</li><li>Baje la pelvis hasta que casi toque el suelo con la rodilla derecha</li><li>Vuelva a subir la pelvis</li><li>Vuelva a la posición con el pie hacia atrás</li><li>Repita, cambiando de pierna cada vez</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a9633731-1d86-4b4a-996f-33a1dee0b0e1',
  'Flexiones a rotación',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Haga una flexión de brazos estándar1.a Acuéstese boca abajo1.b Coloque las manos cerca de las orejas1.c Levante el estómago con los brazos hasta que los brazos estén rectos, manteniendo la espalda recta1.d Flexione los brazos hasta que el pecho casi toque el suelo, asegurándose de que la espalda esté recta1.e Levante el estómago de nuevo, volviendo al paso 3</li><li>Gire el cuerpo hacia un lado para que la espalda quede recta, la mano inferior que sostiene el cuerpo esté completamente extendida y sólo las extremidades inferiores toquen el suelo</li><li>Repita, cambiando de lado en el paso 2 otra vez</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9801e20b-69c3-43d0-9066-450a68230c42',
  'Sentadilla de lado izquierdo',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Póngase de pie y dé un amplio paso lateral, un poco más grande que el ancho de los hombros</li><li>Doble una rodilla hasta que su muslo esté paralelo al suelo. La rodilla doblada debe estar en línea con el pie</li><li>Vuelva a la posición inicial y repita.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'fa9838ed-84e8-476c-8157-1774a9c90aff',
  'Sentadilla de lado derecho',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Póngase de pie y dé un amplio paso lateral, un poco más grande que el ancho de los hombros</li><li>Doble una rodilla hasta que su muslo esté paralelo al suelo. La rodilla doblada debe estar en línea con el pie</li><li>Vuelva a la posición inicial y repita.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7ce489d2-1948-46de-aa80-277b2ca737aa',
  'Sentadilla búlgara izquierda',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Póngase de pie delante de una silla y dé un largo paso. Ponga la parte superior de uno de sus pies en la silla</li><li>Doble la rodilla delantera, balanceando los brazos hasta que la rodilla trasera casi toque el suelo.</li><li>Empuje hacia atrás a la posición inicial y repita.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '44afe80f-1ab2-4149-adbf-d8e0ece990ce',
  'Sentadilla búlgara derecha',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Póngase de pie delante de una silla y dé un largo paso. Ponga la parte superior de uno de sus pies en la silla</li><li>Doble la rodilla delantera, balanceando los brazos hasta que la rodilla trasera casi toque el suelo.</li><li>Empuje hacia atrás a la posición inicial y repita.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6ddea666-5a57-4ac0-926f-01f8cfdaa4fd',
  'Patada de rodilla',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Ponga a cuatro patas</li><li>Empuje un pie hacia atrás hasta que se extienda completamente, concentrándose en los músculos de los glúteos</li><li>Quédese un segundo, y luego vuelva a la posición inicial</li><li>Repita, alternando los pies</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '80d83f98-efe5-4d87-a403-c0feadc8650f',
  'Media sentadillas izquierda',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Párese con la espalda recta</li><li>De un largo paso adelante con su pierna izquierda</li><li>Baje la pelvis hasta que casi toque el suelo con la rodilla derecha</li><li>Suba la pelvis</li><li>Repita desde el paso 3.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1d8599d8-59a5-4faf-a9cf-b81639cbf68b',
  'Media sentadillas derecha',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Párese con la espalda recta</li><li>De un largo paso adelante con su pierna izquierda</li><li>Baje la pelvis hasta que casi toque el suelo con la rodilla derecha</li><li>Suba la pelvis</li><li>Repita desde el paso 3.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cd51aa2a-52b3-43df-8011-0c8ef4b7ed11',
  'Saltar la cuerda: saltos básicos',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Este ejercicio requiere una cuerda para saltar. Asegúrate de que la longitud de la cuerda se ajusta a tu altura. Una forma de comprobarlo es agarrar las dos asas con una mano y situarse en el centro de la cuerda colgando del suelo con un pie. Si la cuerda (excluyendo las asas) te llega justo por debajo del pecho, su longitud es la adecuada. Una cuerda más corta sería peligrosa, ya que podrías golpearte, y una cuerda más larga sería una mala forma.</p><ol><li>Pon los pies juntos, dobla un poco las rodillas, mantén la cabeza y el cuerpo rectos, mantén los codos dentro, abre los brazos.</li><li>Gira sólo las muñecas con la fuerza suficiente para hacer girar la cuerda.</li><li>Salta lo suficiente para pasar la cuerda por debajo de tus pies.</li><li>Repite desde el paso 2.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9d9c4c9f-045f-4af5-adf2-8bb07c3516dc',
  'Círculos de brazo',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Ponte de pie con la espalda recta.</li><li>Lleva los brazos hacia delante, levántalos por encima de la cabeza y luego continúa el movimiento por detrás de la espalda y baja a la posición inicial.</li><li>Siga haciendo círculos con los brazos como se describe en el paso 2.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '69b3da17-11cc-41fe-bbc1-ee6c45ced41c',
  'Backward arm circles',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Stand tall with your back straight.</p><p>Steps:</p><ol><li>Keeping your arms straight, bring them in front of you, raise them over your head, then continue the motion behind your back and down to the initial position.</li><li>Keep circling your arms as described in step 1.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '53324f8e-df38-456f-9b7d-8f3a43f45f31',
  'Montañeros',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Posición inicial:</p><p>Comienza en la posición de flexión vertical o plancha alta.Las manos deben estar directamente debajo de los hombros.Mantenga la cabeza alineada con la espalda, mirando al suelo.Los pies deben estar separados a la anchura de las caderas.</p><p>Pasos:</p><ol><li>Mueve una rodilla hacia el centro del cuerpo, hacia los codos, manteniendo la otra pierna extendida.</li><li>Con un movimiento rápido de salto, estira la pierna doblada y tira de la otra rodilla hacia tu cuerpo.</li><li>Sigue repitiendo el paso 2, alternando las piernas.</li></ol><p>Notas:</p><p>Durante todo el ejercicio, la espalda debe permanecer lo más recta posible, evitando una joroba o una espalda flácida.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '18d277a0-7222-46e7-b2bf-47c8ed169c30',
  '4-count burpees',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Stand straight, feet hip-width apart.</p><p>Steps:</p><ol><li>Squat low and support yourself on the floor with your hands between the knees and in front of your feet, your back straight.</li><li>Keeping your hands on the floor, jump your legs backward into high plank position.</li><li>Jump your feet forward to return to the squat position.</li><li>Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '853e4429-da4a-492d-b042-5c124282c005',
  'No push-up burpees',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Stand straight, feet hip-width apart.</p><p>Steps:</p><ol><li>Squat low and support yourself on the floor with your hands between the knees and in front of your feet, your back straight.</li><li>Keeping your hands on the floor, jump your legs backward into high plank position.</li><li>Jump your feet forward to return to the squat position.</li><li>Jump up.</li><li>Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '616f9026-1a1d-4ed8-b068-cfbb81b6a000',
  'Arremetidas inversas',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Posición inicial:</p><p>De pie, con los pies separados a la altura de las caderas.</p><p>Pasos:</p><ol><li>Da un paso hacia atrás con una pierna para que pueda doblarse cómodamente hasta un ángulo de 90 grados.</li><li>Doble lentamente ambas rodillas hasta formar un ángulo de 90 grados.</li><li>Vuelva a la posición inicial.</li><li>Repita, alternando las piernas.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cf79d9fb-ffce-4648-a64f-27e4274e4c20',
  'Fondos',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Posición inicial:</p><p>Siéntate con los brazos detrás de ti, apoyando la espalda.Los dedos deben apuntar hacia adelante.Las rodillas deben estar dobladas y los pies juntos.</p><p>Pasos:</p><ol><li>Levanta las caderas del suelo, estirando los brazos.</li><li>Dobla los codos, llevando las caderas hacia abajo.</li><li>Endereza los brazos, volviendo a la posición anterior.</li><li>Repita los pasos 2 y 3.</li></ol><p>Notas:</p><p>La dificultad del ejercicio depende de la altura de las caderas.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b2b40a54-e42b-49ec-97da-4c929ae41d42',
  'High plank',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Get into the high plank position:your hands and toes should be touching the ground, your back, arms and legs should be straight.To get to this position, you can lie down on your stomach, place your hands facing down next to your head, and lifting your arms up until they are straight.</p><p>Steps:</p><ol><li>Maintain the starting position for the entire duration of the exercise.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6e1af72c-f9f5-490d-8977-564df4f24b6f',
  'Child''s pose',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Start on all fours, knees, toes, and hands touching the ground. Your two big toes should be touching.</p><p>Steps:</p><ol><li>Move your knees so that they''re about hip-width apart.</li><li>On an exhale, move your pelvis back to sit on your heels. Your hands should still be touching the ground.</li><li>Relax your upper body, lowering your forehead to the floor and letting your hands move forward naturally.</li><li>Stay in this pose.</li></ol><p>Tips:</p><ul><li>To leave the pose, walk your arms back under your shoulders and move your upper body up into a seated position.</li></ul>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9b5f8c6e-2436-4ded-aea9-8c698b0c8768',
  'Kettlebell deadlifts',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Stand hip-width apart, with your kettlebell centered between your ankles. Your back should be straight, your head facing forward.</p><p>Steps:</p><ol><li>Hinge at the hips and slightly bend at the knees to put your hands on the kettlebell handles. Your back should be straight as you perform the movement.</li><li>Grab the kettlebell handles, with your hands pushing in opposite directions as if to pull the handle apart.</li><li>While contacting your abs and glutes, stand straight up.</li><li>Hinge at the hips again to bring the kettlebell back down, similarly to step 1.</li><li>Repeat from step 3.</li></ol><p>Tips:</p><ul><li>Be sure you''re performing the movements correctly, as doing otherwise can lead to injury. For example, do not squat instead of hinging at the hips, do not round your back while reaching for the kettlebell, and do not lean back while standing up.</li></ul>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4b278f57-4505-419a-8b34-172b53eb4adc',
  'Forward shoulder rotation',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Place your hands on your shoulders.</li><li>Repeatedly rotate both shoulder joints in a circular motion at a moderate pace.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1a40cc23-4609-4951-9b76-237715ae85ed',
  'Backward shoulder rotation',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Place your hands on your shoulders.</li><li>Repeatedly rotate both shoulder joints in a circular motion at a moderate pace.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '04e7fd92-e2e5-4212-ad7c-7542e98f7d83',
  'Chin tuck',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Use fingers on your chin to slowly tuck your chin in, moving your head back to align it with your spine.</li><li>Hold for 5 seconds.</li><li>Go back to normal head position and repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '336e224a-a7a1-4808-9871-1ad8cfc3fee7',
  'Head turns',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight and shoulders down.</p><p>Steps:</p><ol><li>Sit or stand up straight, shoulders dropped.</li><li>Turn your head to the side as far as possible. Stop when you hit a barrier and hold for 5 seconds.</li><li>Return to center position and repeat, changing sides.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2ecf2e55-c1f3-40ac-b20e-0954f41a2021',
  'Left neck stretch',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Tilt your head to the side.</li><li>Take the hand closer to your head and use it to grab your head from the other side.</li><li>Push with your hand against your head and with your head against your hand so that the forces balance out and your head stays still.</li><li>Maintain this tension until the end of the exercise.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7ea504e7-3310-4638-a111-054fabfd4b80',
  'Right neck stretch',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Tilt your head to the side.</li><li>Take the hand closer to your head and use it to grab your head from the other side.</li><li>Push with your hand against your head and with your head against your hand so that the forces balance out and your head stays still.</li><li>Maintain this tension until the end of the exercise.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b646e62d-c616-4460-b4d1-23cc6a6ddb51',
  'Back neck stretch',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit upright on a chair or a firm pillow.</p><p>Steps:</p><ol><li>Breathe out and tilt your head forward, chin to chest, putting hands behind your head.</li><li>Use your hands to pull your head down lightly and press against your hands with your head to balance out the force.</li><li>Hold for a bit.</li><li>Relax your arms and head, opening up a bit with your shoulders.</li><li>Keep repeating this from step 2 onward.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'dcbfa3f0-ba88-4633-a30d-c188dccc5d3f',
  'Front neck stretch',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Open mouth wide.</li><li>Slowly tilt head back with mouth opened. If you feel the need for support, clasp your hands behind your head.</li><li>Very slowly close and open your mouth.</li><li>At the end, slowly return to starting position and close mouth.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a136959c-b0c8-49d3-99b9-0a5f41abf00e',
  'Curl de biceps alterno',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Posición inicial: Comience de pie con pesas en cada mano, la espalda recta y los pies separados al ancho de las caderas. Tus brazos deben estar relajados, apuntando hacia abajo. Tus rodillas deben estar ligeramente flexionadas, tus abdominales contraídos y tus hombros hacia abajo.&nbsp;Pasos:&nbsp;
1. Dobla un brazo por el codo, llevando la mancuerna hasta tu hombro. La parte superior del brazo debe permanecer inmóvil durante este movimiento. 2. Lleva la mancuerna hacia abajo hasta que tu brazo esté en su posición original relajada.&nbsp;
3. Repita, cambiando de brazo.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7f8997d2-e21f-492f-a470-b9f0c5e54f1d',
  'Left levator scapulae stretch',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Start standing up or sitting down. Turn your head to the left, around 45 degrees or just above your nipple. Place your right hand behind your back or sit on it. Take your left hand and use it to hold the back of your head. Lean your head down slightly.</p><p>Steps:</p><ol><li>After assuming the starting position, press your head against your left hand with slight force. Your hand should press back with equal force, so that your head doesn''t move. Hold this position.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8374a856-9293-4b90-900e-00c3bfe21cc4',
  'Right levator scapulae stretch',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Start standing up or sitting down. Turn your head to the right, around 45 degrees or just above your nipple. Place your left hand behind your back or sit on it. Take your right hand and use it to hold the back of your head. Lean your head down slightly.</p><p>Steps:</p><ol><li>After assuming the starting position, press your head against your right hand with slight force. Your hand should press back with equal force, so that your head doesn''t move. Hold this position.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b50a3d3e-cf75-42de-8729-80e163748fb1',
  'Clockwise neck circles',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Start sitting or standing. Drop your head down, bringing your chin toward your chest, but not pushing.</p><p>Steps:</p><p>In a slower fluid motion and with your head relaxed and not pushing in any direction:</p><ol><li>lean toward your right shoulder.</li><li>then bring your head back, facing up.</li><li>then lean toward your left shoulder.4.and back toward the starting position.</li></ol><p>Keep repeating this as part of one slower fluid motion.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '00ecb956-9483-4d08-a9b1-6a236d4d8ff3',
  'Counterclockwise neck circles',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Start sitting or standing. Drop your head down, bringing your chin toward your chest, but not pushing.</p><p>Steps:</p><p>In a slower fluid motion and with your head relaxed and not pushing in any direction:</p><ol><li>lean toward your left shoulder.</li><li>then bring your head back, facing up.</li><li>then lean toward your right shoulder.4.and back toward the starting position.</li></ol><p>Keep repeating this as part of one slower fluid motion.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8bffd3b2-663a-4617-9d95-dce24e795470',
  'Neck half circles',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Start sitting or standing. Lean your head against one of your shoulders, but don''t push.</p><p>Steps:</p><p>In one slower fluid motion and with your head relaxed and not pushing in any direction:</p><ol><li>bring your head down toward your chest.</li><li>then lean back aganst your other shoulder.</li><li>then back toward the chest again.4.and finally toward the starting position.</li></ol><p>Keep repeating this.</p>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '36eaf240-db34-4d83-bba9-94d0e989c9e2',
  'Head tilts',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p>Starting position:</p><p>Sit or stand with your back straight.</p><p>Steps:</p><ol><li>Tilt your head to one side and hold for a bit.2.Return your head to neutral position and hold for a bit.</li><li>Tilt your head to the other side and hold for a bit.</li><li>Return your head to neutral position yet again and hold for a bit.</li><li>Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5e2761cf-839e-435e-bedb-35e132dcb5ce',
  'Plancha de lado derecho',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Acuéstese sobre su lado correspondiente, con el codo en ángulo recto y el brazo hacia afuera</li><li>Levante la pelvis del suelo levantando el hombro hacia arriba, manteniendo el antebrazo en el suelo; la cabeza, la pelvis y los pies deben estar en línea recta</li><li>Mantenga esta posición</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ec9dca8d-1456-430a-abed-70b8bab4779a',
  'Sentadillas en pistol derecha',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Párese en una pierna, con la otra pierna estirada y ligeramente hacia adelante.</li><li>Doble una rodilla lentamente, bajando en sentadilla y manteniendo la espalda y la otra pierna estirada.</li><li>Levántese lentamente de la sentadilla, enderezando la rodilla doblada y manteniendo la otra pierna recta.</li><li>Repita</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '04ba9a37-4725-43f0-a0b6-767cdab9a79e',
  'Elevación de pantorrilla derecha',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Párese en el suelo o en el borde de un escalón para aumentar el rango de movimiento. Levante un pie, colocando la parte superior de su pantorrilla</li><li>Levante los talones hasta que esté de pie</li><li>Manténgase en esta posición durante tres segundos, luego baje el pie sin tocar el suelo con el talón.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '768e0703-a04d-4d97-89ce-a49cd6be2b06',
  'Single Arm Plank to Row',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Start position as row, extend to plank and back. Finish with row and repeat',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '302e02df-4270-4a0b-8c5d-b743cdb06fc9',
  'Elevated prayer stretch',
  'back',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<b>Starting position:</b>
Kneel in front of a bench, far enough so that your torso can fit between your knees and the bench. With your back straight, place your elbows on the bench, with palms together, hands pointing up.
<b></b>
<b>Steps:</b>
<ol><li>On exhale, stretch your chest down toward the floor without moving your lower back. At the same time, bring your hands toward your shoulders, keeping palms together and elbows on the bench.</li><li>Hold for a few seconds.</li><li>On inhale, relax your back to return to the starting position.</li><li>4. Repeat.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '25854f7a-485a-4280-a0fa-f024655733b0',
  'Quadruped thoracic rotation left',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<b>Starting position:</b>
Start kneeling on all fours, knees shoulder-width apart. Place your left hand behind your head while keeping your right hand outstretched and touching the floor.

<b>Steps:</b>
<ol><li style="">On inhale, move your left elbow toward your right hand, keeping your left hand behind your head.</li><li style="">On exhale, move your left elbow to point up toward the ceiling.</li><li style="">Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'da588c5e-ab8b-42a7-a52c-1e680a484334',
  'Quadruped thoracic rotation right',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<p style=""><b>Starting position:</b></p><p style="">Start kneeling on all fours, knees shoulder-width apart. Place your right hand behind your head while keeping your left hand outstretched and touching the floor.</p><p style=""><b>Steps:</b></p><ol style=""><li style="">On inhale, move your right elbow toward your left hand, keeping your right hand behind your head.</li><li style="">On exhale, move your right elbow to point up toward the ceiling.</li><li style="">Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '431bb116-2833-4f28-b9e4-350fab6dc145',
  'Plate twist',
  'abs',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Step 1: Sit on an exercise mat with your legs extended in front of you. 
Step 2: Grasp a plate in both hands as if holding a steering wheel, arms slightly bent, and hold it in front of your abdominals. 
Step 3: With knees slightly bent, cross your ankles and slowly lift them a few inches off the floor. 
Step 4: Keep your back straight but lean backward slightly to help maintain balance. 
Step 5: Exhaling, rotate your torso (twist) to the right side and touch the end of the plate to the floor. 
Step 6: Inhale and return to the forward facing start position. 
Step 7: Exhaling, rotate your torso (twist) to the left side and touch the end of the plate to the floor. 
Step 8: Inhale and return to the forward facing start position. 
Step 9: Repeat for a full set.',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '476c1d96-6590-4f86-98f0-3f12808fab53',
  'Hindu Pushups',
  'shoulders',
  '["triceps"]',
  'other',
  2.5,
  NULL,
  'Ejercicio para fortalecer los hombros y pectorales. Su nombre se debe a que se empieza en la postura de Yoga "Perro boca abajo", pasando a "Cobra" pero sin apoyar las piernas ni torso en el suelo para finalmente acabar con una flexión normal. El ejercicio también se puede realizar hacia atrás (de vuelta a la postura inicial). Como variación, tras hacer la flexión, se puede elevar la cadera para volver a la postura del perro boca abajo',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '664ddd40-a595-420d-801f-148e4bf0594c',
  'Shoulder dislocates',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<b>Starting position:</b>
Stand up with your back straight and a resistance band, towel, or broomstick handle in hand. With your hands straight in front of your body and the band between your hands, push your hands apart to both be at around 45 degrees from your body, thumbs facing down. If using a towel or broomstick handle instead, grab it with an overhand grip.

<b>Steps:</b>
<ol><li>Keeping your arms outstretched, rotate at the shoulders to bring your arms overhead and then down toward your glutes.</li><li>Rotate at the shoulders in the opposite direction — overhead and then toward your groin.</li><li>Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f3f4e9c5-9bf6-43f6-a2cf-798507a50293',
  'Bent over row to external rotation',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<b>Starting position:</b>
Stand behind a chair or in front of a table. Bend at the waist to put your forehead on the chair''s headrest or table, keeping your back straight. Your arms should be hanging straight down, pointed at the floor.
<b></b>
<b>Steps:</b>
<ol><li>Bring your elbows up to shoulder height. Your forearms should be pointing down, perpendicular to your biceps. Your biceps should be at the same height as your back and perpendicular to your spine.</li><li>Hold for a bit.</li><li>Rotate at your elbows to bring your hands as far up as you can.</li><li>Hold for a bit.</li><li>Rotate at your elbows back to the previous position.</li><li>Bring your arms down to the original position.</li><li>Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '981b07b6-e76e-438c-bad4-388441b7ff33',
  'YWTs',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  '<b>Starting position:</b>
Lie down, preferably on a mat. Stretch your arms above your head in a "Y" position (arms pointing up diagonally at around 45 degrees). Your thumbs should be pointing up.

<b>Steps:</b>
<ol><li>With arms in the Y position, lift your chest slightly from the ground, creating a pull tension in your arms upward.</li><li>Hold this position for several seconds (15–30 is ideal).</li><li>Keeping your chest up, bend at your elbows to move from a Y position to a "W" position, with arms bent at the elbows and maintaining the upward tension.</li><li>Hold for around as long as with the Y position.</li><li>Still with your chest up, move to a "T" position, straightening your arms out to the side to be perpendicular to your body.</li><li>Hold for around as long as you held the W position.</li><li>Move from the T position to the W position, then from the W position to the Y position.</li><li>Repeat.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e4966cb8-9089-4595-9c78-99a27821e6ff',
  'Dumbbell Floor Press',
  'chest',
  '["shoulders","biceps","triceps"]',
  'dumbbell',
  2.5,
  NULL,
  'Grab your dumbbells and lay flat on your back with your knees bent and your feet flat on the ground (use a bench if you have one). Press the weights up, locking out your elbows (A). Lower them slowly until your upper arms are resting on the floor (B) close to your body. Pause here before explosively pressing back up. Squeeze your chest hard and repeat.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '927b0e58-c57c-4234-8079-2548f8e35687',
  'Dumbbell Bent Over Row',
  'shoulders',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '&nbsp;Hold&nbsp;your dumbbells&nbsp;at your sides and hinge at the hips until your chest is parallel to the floor, dumbbells hanging below your knees (picture 1). Keeping your elbows close to your body, row both dumbbells towards your hips (oicture 2). Squeeze your shoulder blades down and together and lower under control to the start before repeating. Avoid using momentum from your torso and focus on squeezing your back, hard.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '44cfa56c-d8c2-4f2c-8b5a-f29810fd60e7',
  'Close-grip Press-ups',
  'biceps',
  '["shoulders","biceps","triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Drop into a strong plank position, bringing your hands close together until they''re almost touching.&nbsp;(picture 1)<b>&nbsp;</b>Bend your elbows to slowly bring your chest to the floor&nbsp;(picture 2). Keep your elbows close to your body as you push back up explosively. Repeat. Ensure you take your time lowering on each rep, keeping your form sharp.',
  'https://wger.de/static/images/muscles/main/muscle-13.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f0f53b8e-0136-4195-baf3-781903651359',
  'Dumbbell Hang Power Cleans',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'On your feet, stand tall with your dumbbells, holding them at your sides. Hinge at the hips to lower them to your knees (picture 1). Stand back up with a slight jump, using the momentum to pull the dumbbells up on to your shoulders (picture 2). Stand up straight, then lower under control to your sides and repeat. Keep this fast and explosive; if your heart rate doesn’t hit the roof, you’re doing them wrong.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0c30c543-e2cc-499b-bc31-8c28db445ed2',
  'Dumbbell sumo deadlift',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Lower your dumbbell to the ground between your legs. Assume a wide stance and with a straight back squat down. With the dumbbell standing upright, grip it by the top of the ‘head’&nbsp;(picture 1).<b>&nbsp;</b>Keeping your chest up and core braced, push the floor away, driving back upwards to a standing position&nbsp;(picture 2). Repeat. If you can easily achieve 20-30 reps, use two dumbbells.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '66c7eb38-77b5-4d2f-810f-cddd8d97d5a3',
  'Medicine ball twist',
  'abs',
  '[]',
  'other',
  2.5,
  NULL,
  'In a seated position, the torso is rotated from side to side without forcing, approaching the knees and making the ball touch the ground from time to time',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '36b6919a-0e9d-49c6-891b-28fb55ae88ad',
  'Vpushup',
  'chest',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Lift your body off the ground by pushing your arms upwards',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '75d730d0-3b26-4a25-8f1a-7119a98e02ef',
  'Plancha a una mano alterna',
  'shoulders',
  '["back"]',
  'bodyweight',
  2.5,
  NULL,
  'En la posición de plancha correcta, coloque los pies a una distancia ligeramente superior a la anchura de los hombros. Levante y toque alternativamente el hombro opuesto con una mano.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd301d901-a2c6-4916-b09e-07ab7a3c8519',
  'Bag training',
  'shoulders',
  '["biceps","hamstrings","calves","back","abs"]',
  'bodyweight',
  2.5,
  NULL,
  'Bag training improves muscle definition of: deltoids; rear deltoids; triceps; biceps, as well as being a great cardio exercise',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f6d8e157-c233-4a22-9c1a-83cb8f613ea5',
  'Rowing Machine',
  'shoulders',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Sit on a rowing machine with your back straight. ',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '117df66c-bc8d-43cc-9903-0be2a0864486',
  'Press Banca Sentado',
  'chest',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Poner la máquina de press de pecho para que al sentarte los agarres estén alineados con la parte inferior del pecho. Asegúrate de que estás sentado con la espalda bien pegada al asiento. Agarra una manija con cada mano, saca el pecho hacia afuera, mantén la cabeza contra el reposacabezas. Respira profundamente y empuja lentamente las manijas hacia adelante hasta que tus brazos estén casi completamente extendidos. Haz una pausa justo antes del bloqueo, y luego regresa lentamente las manijas a la posición inicial. Haz una pausa justo antes de que las manijas se detengan completamente y realiza otra repetición',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'acbe9416-c717-40f4-a30e-9375b1f3e797',
  'Press de banca sentado',
  'chest',
  '["shoulders","triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Pon la máquina de press de pecho para que al sentarte los agarres estén alineados con la parte inferior del pecho. Asegúrate de que estás sentado con la espalda bien pegada al asiento. Agarra una manija con cada mano, saca el pecho hacia afuera, mantén la cabeza contra el reposacabezas.

Respira profundamente y empuja lentamente las manijas hacia adelante hasta que tus brazos estén casi completamente extendidos. Haz una pausa justo antes del bloqueo, y luego regresa lentamente las manijas a la posición inicial. Haz una pausa justo antes de que las manijas se detengan completamente y realiza otra repetición.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd015a276-02ad-4c28-9d36-aedfbb431f53',
  'Abduktion im Stand',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Das Training des stabilen Standes dominat auf einem Bein ist beiseitig entscheidend. Einerseits um Beschwerden vorzubeugen und andererseits um eine stabile Basis zu legen.Die übende Person stellt sich in die gewohnte Standposition und versucht bei stabilem Oberkörper das unbelastete Bein wiederholt zu heben und und in Hüfte und Knie zu beugen und wieder zu senken. Die Bewegung wird jedenfalls auch mit der anderen Seite wiederholt.
Die Übung trainiert die Stabilität der hüftumgebenden Muskulatur',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f3ec1836-ef65-490e-8246-5ab0d3640a7f',
  'Abduktion im Stand',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Das Training des stabilen Standes dominat auf einem Bein ist beiseitig entscheidend. Einerseits um Beschwerden vorzubeugen und andererseits um eine stabile Basis zu legen.Die übende Person stellt sich in die gewohnte Standposition und versucht bei stabilem Oberkörper das unbelastete Bein wiederholt zu heben und und in Hüfte und Knie zu beugen und wieder zu senken. Die Bewegung wird jedenfalls auch mit der anderen Seite wiederholt.
Die Übung trainiert die Stabilität der hüftumgebenden Muskulatur',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'c302fd80-ce74-4202-9eee-30834872cffb',
  'Seated rear delt rise',
  'back',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Seated, bent 45 deg forward. Arms fully stretched out, raise arms up to shoulder height and back down',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '45d89ca5-f5c7-4e56-9833-fd160cd2666d',
  'Dynamic side hold',
  'abs',
  '["abs"]',
  'dumbbell',
  2.5,
  NULL,
  'Sling a rubber band on a kettlebell and lift the kettlebell by the rubber band. Let it hang by your side and stand on one leg, switch leg while continuing hold. Repeat with other hand',
  'https://wger.de/static/images/muscles/main/muscle-14.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f20ab712-f953-4705-8710-9681392ddd07',
  'Wall balls',
  'shoulders',
  '["biceps","chest","abs","traps"]',
  'other',
  2.5,
  NULL,
  'Get a medicine ball, shoulder width stance, squat, thrust the ball as high as possible against the wall and catch',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8ccd5844-4b46-475d-b36f-5f58ca496840',
  'Horizontal traction isometry',
  'back',
  '["shoulders","biceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Perform a timed isometric pull-up on the bar',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '5831bcbb-28a7-4bd5-930d-a740acccf747',
  'Alternate back lunges',
  'glutes',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'The posterior muscles of the buttocks, hamstrings, soleus and gastrocnemius are trained more',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f636ae1c-f678-48fe-96b3-1a9ae81f43ce',
  'walking bridge',
  'abs',
  '["shoulders","biceps","glutes","back"]',
  'bodyweight',
  2.5,
  NULL,
  'from a standing position with knees slightly bent and hands resting on the floor. From here, proceed forward with your hands keeping your buttocks contracted and without losing control of your lower back.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2e00d8e5-19a2-42ad-a954-f06a56f56561',
  'Walking',
  'hamstrings',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Walking outdoor or indoor, try keeping a pace of at list 100 steps per minute.',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '371cfda2-1de6-419a-b40c-fc98fd3f7e41',
  'Seated Knee Tuck',
  'abs',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  'Sit on floor or mat. Place arms slightly behind you. Raise legs. Now extend your legs and pull them back.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3a8a9588-3d19-4042-84e5-2ff49a842c67',
  'Seated Knee Tuck',
  'abs',
  '["abs"]',
  'bodyweight',
  2.5,
  NULL,
  'Sit on floor or mat. Place arms slightly behind you. Raise legs. Now extend your legs and pull them back.',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'b1bf02cf-17b2-4bfc-a5b0-4ff7a2768dbb',
  'Biceps concentrado',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  'El curl de concentración es un ejercicio clásico para desarrollar los bíceps un brazo a la vez. Se puede realizar inclinado o de rodillas, pero se realiza más a menudo sentado en un banco. Es excelente para enfatizar el pico del bíceps y, a menudo, se usa para terminar un entrenamiento de bíceps.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f509a2e2-a9f1-48c0-8421-836836110fdc',
  'Push-Ups',
  'chest',
  '["triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Push-ups are an exercise in which a person, keeping a prone position, with the hands palms down under the shoulders, the balls of the feet on the ground, and the back straight, pushes the body up and lets it down by an alternate straightening and bending of the arms.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4aa7e2a7-86ad-4322-978f-ff8b391f556c',
  'Push-Ups | Incline',
  'chest',
  '["triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Inclined push-ups primarily target the chest muscles (pectoralis major and minor), but also work the triceps, shoulders, and core to a lesser extent. Because the upper body is elevated, the incline push-up places less emphasis on the triceps compared to regular push-ups, which may be beneficial for individuals looking to specifically target their chest muscles.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '50037aaf-34f1-4018-b504-206623b77c46',
  'Push-Ups | Decline',
  'chest',
  '["shoulders","triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Decline push-ups are another modified version of the traditional push-up that target the upper body muscles in a different way. To perform a decline push-up, elevate your feet on an elevated surface, such as a bench, chair, or step, while placing your hands on the ground in a push-up position. Lower your body towards the ground while maintaining a straight line from your shoulders to your ankles, and then push back up to the starting position.

Unlike the inclined push-up, the decline push-up places more emphasis on the shoulders and triceps, while still engaging the chest muscles to a lesser extent. By elevating your feet, you increase the difficulty of the exercise by placing more weight on your upper body, forcing your shoulders and triceps to work harder to push your body back up. The decline push-up can be a great way to challenge your upper body strength and improve your ability to perform other push-up variations. As with any exercise, be sure to use proper form and start with a height that is appropriate for your strength and fitness level.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'bd141adb-b9ad-4038-b11f-1db8665f72bc',
  'Push-Ups | Parallettes',
  'chest',
  '["shoulders","triceps"]',
  'other',
  2.5,
  NULL,
  'Parallettes push-ups are a variation of the traditional push-up that are performed with the hands on parallel bars, known as parallettes. To perform a parallettes push-up, assume a push-up position with your hands on the parallettes and your feet on the ground. Lower your body towards the ground while keeping your elbows close to your sides, and then push back up to the starting position.

Parallettes push-ups place more emphasis on the chest and shoulders compared to traditional push-ups, as they allow for a greater range of motion in the shoulder joint. This increased range of motion can also help to improve shoulder stability and mobility. Additionally, parallettes push-ups engage the core muscles more than traditional push-ups, as the instability of the parallettes requires greater activation of the core muscles to maintain proper form.

The added challenge of balancing on the parallettes also requires greater upper body strength and control, making parallettes push-ups a more advanced variation of the traditional push-up. They can be a great way to challenge yourself and add variety to your upper body workout routine. As always, be sure to use proper form and start with a level that is appropriate for your strength and fitness level.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'af5a3520-25eb-4dd7-b802-a7382b8ce3ef',
  'Rest (for timed workouts)',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'When creating a workout based on time, add this to add rest time in the program',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7c2a70bc-ed97-440c-afd6-ed27daf63f25',
  '3D lunge warmup',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'As a warmup, use light dumbbells, one in each hand. Lunge in alternating directions, forward, sideways, backwards and 45 degree angles.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3393db0b-98b7-4d53-a0d4-985f97875295',
  'Dumbbell farmer''s carrie',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Grab half your body weight in each hand and walk.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '0ecfec6f-5d0f-4e8a-8d37-f6203a8923b8',
  'Remo maquina abierto',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Remo en maquina o polea con barra larga...',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3a0bfbe7-9a9e-43af-9fcd-f2aedcc99852',
  'Remo maquina abierto supino',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Remo en maquina o maquina de polea con barra ancha y agarre supino',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ace5d444-6a41-44bc-a4b6-548bb18cfc9b',
  'Remo maquina agarre estrecho',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Remo en máquina con barra en agarre estrecho',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '443fec2e-dcca-46fe-ab4a-9a8beb50891e',
  'Remo maquina agarre estrecho supino',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Remo en máquina o polea con agarre cerrado supino',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e87d355b-d2a4-40c4-a2de-e09e8a701c9d',
  'Elevación de talón sentados',
  'calves',
  '[]',
  'other',
  2.5,
  NULL,
  'Posición&nbsp; inicial&nbsp;
•&nbsp; Siéntese&nbsp; en&nbsp; la&nbsp; máquina&nbsp; y&nbsp; coloque&nbsp; las&nbsp; rodillas&nbsp; y&nbsp; los&nbsp; muslos&nbsp; debajo&nbsp; de&nbsp; las&nbsp; almohadillas.&nbsp;&nbsp;
•&nbsp; Coloque&nbsp; las&nbsp; puntas&nbsp; de&nbsp; los&nbsp; pies&nbsp; en&nbsp; el&nbsp; borde&nbsp; más&nbsp; cercano&nbsp; del&nbsp; escalón&nbsp; con&nbsp; los&nbsp; pies&nbsp;&nbsp;
paralelos&nbsp; entre&nbsp; sí.&nbsp; •&nbsp; Apunte&nbsp; ligeramente&nbsp;&nbsp;
con&nbsp; los&nbsp; dedos&nbsp; de&nbsp; los&nbsp; pies&nbsp; para&nbsp; levantar&nbsp; las&nbsp; almohadillas&nbsp; de&nbsp; los&nbsp; muslos&nbsp; y&nbsp; quitar&nbsp; la&nbsp; barra&nbsp;&nbsp;
de&nbsp; apoyo.&nbsp; •&nbsp; Permita&nbsp; que&nbsp; sus&nbsp; talones&nbsp;&nbsp;
bajen&nbsp; más&nbsp; abajo&nbsp; que&nbsp; el&nbsp; escalón&nbsp; hasta&nbsp; que&nbsp; sienta&nbsp; un
Movimiento&nbsp; hacia&nbsp; arriba&nbsp;&nbsp;
•&nbsp; Ponga&nbsp; los&nbsp; dedos&nbsp; de&nbsp; los&nbsp; pies&nbsp; en&nbsp; punta&nbsp; para&nbsp;&nbsp;
levantar&nbsp; los&nbsp; talones.&nbsp; •&nbsp; No&nbsp; tire&nbsp; de&nbsp; las&nbsp; asas&nbsp; ni&nbsp; incline&nbsp; el&nbsp; torso&nbsp; hacia&nbsp; atrás.
Elevación&nbsp; de&nbsp; talón&nbsp; sentado
Movimiento&nbsp; descendente
estirar.
Posición&nbsp; inicial
•&nbsp; Permita&nbsp; que&nbsp; sus&nbsp; talones&nbsp; vuelvan&nbsp; a&nbsp; caer&nbsp; a&nbsp; la&nbsp; posición&nbsp; inicial.&nbsp; •&nbsp; Cuando&nbsp;&nbsp;
complete&nbsp; el&nbsp; conjunto,&nbsp; mueva&nbsp; la&nbsp; barra&nbsp; de&nbsp; apoyo&nbsp; a&nbsp; su&nbsp; lugar.&nbsp;',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ad20f70b-fcda-4282-a452-0cd8c3b38eda',
  'Elevación de talón de pie',
  'calves',
  '[]',
  'other',
  2.5,
  NULL,
  'Posición&nbsp; inicial
•&nbsp; Mire&nbsp; hacia&nbsp; la&nbsp; máquina&nbsp; y&nbsp; coloque&nbsp; las&nbsp; puntas&nbsp; de&nbsp; los&nbsp; pies&nbsp; en&nbsp; el&nbsp; borde&nbsp; más&nbsp; cercano&nbsp; del&nbsp; escalón&nbsp; con&nbsp; los&nbsp; pies&nbsp; paralelos&nbsp; entre&nbsp; sí.&nbsp;&nbsp;
•&nbsp; Sumerja&nbsp; su&nbsp; cuerpo&nbsp; debajo&nbsp; de&nbsp; las hombreras&nbsp; y&nbsp; póngase&nbsp; de&nbsp; pie&nbsp; con&nbsp; el&nbsp; cuerpo&nbsp; completamente&nbsp; erguido.
•&nbsp; Permita&nbsp; que&nbsp; sus&nbsp; talones&nbsp; caigan&nbsp; más&nbsp; abajo&nbsp; que&nbsp; el&nbsp; escalón&nbsp; hasta&nbsp; que&nbsp; sienta&nbsp; un&nbsp; estiramiento.
•&nbsp; No&nbsp; permita&nbsp; que&nbsp; le&nbsp; bloqueen&nbsp; las&nbsp; rodillas.&nbsp;

Movimiento&nbsp; hacia&nbsp; arriba&nbsp;&nbsp;
•&nbsp; Ponga&nbsp; los&nbsp; dedos&nbsp; de&nbsp; los&nbsp; pies&nbsp; en&nbsp; punta&nbsp; para&nbsp; levantar&nbsp; los&nbsp; talones arriba.
•&nbsp; Mantenga&nbsp; su&nbsp; cuerpo&nbsp; erguido&nbsp; y&nbsp; no&nbsp; mire&nbsp; hacia&nbsp; abajo&nbsp; ni&nbsp; se&nbsp; incline&nbsp; hacia&nbsp; adelante&nbsp; o&nbsp; hacia&nbsp; atrás.

Movimiento&nbsp; descendente
•&nbsp; Permita&nbsp; que&nbsp; sus&nbsp; talones&nbsp; vuelvan&nbsp; a&nbsp; caer&nbsp; a&nbsp; la&nbsp; posición&nbsp; inicial.&nbsp;&nbsp;
•&nbsp; Mantenga&nbsp; su&nbsp; cuerpo&nbsp; completamente&nbsp; erguido&nbsp; y&nbsp; no&nbsp; rebote&nbsp; desde&nbsp; la&nbsp; posición&nbsp; más&nbsp; baja&nbsp; para&nbsp;&nbsp;
comenzar&nbsp; el&nbsp; movimiento&nbsp; ascendente.',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '62350da8-b589-4022-a94a-3341f79295a4',
  'Jalón abierto',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  '
Movimiento&nbsp; descendente
•&nbsp; Tire&nbsp; de&nbsp; la&nbsp; barra&nbsp; hacia&nbsp; abajo&nbsp; para&nbsp; que&nbsp; pase&nbsp; cerca&nbsp; de&nbsp; su&nbsp; barbilla&nbsp; y&nbsp; toque&nbsp; la&nbsp; parte&nbsp; superior&nbsp;&nbsp;
de&nbsp; su&nbsp; pecho.&nbsp;&nbsp;
•&nbsp; Mantenga&nbsp; el&nbsp; resto&nbsp; de&nbsp; su&nbsp; cuerpo&nbsp; inmóvil.

Movimiento&nbsp; hacia&nbsp; arriba&nbsp;&nbsp;
•&nbsp; Permita&nbsp; que&nbsp; sus&nbsp; codos&nbsp; se&nbsp; extiendan&nbsp; para&nbsp; permitir&nbsp; que&nbsp; la&nbsp; barra&nbsp; suba&nbsp; hasta&nbsp; la&nbsp; posición&nbsp; inicial.
posición.&nbsp;&nbsp;
•&nbsp; Mantenga&nbsp; el&nbsp; resto&nbsp; de&nbsp; su&nbsp; cuerpo&nbsp; inmóvil.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd33f3b19-436f-48a2-aff6-946582c94bdb',
  'Jalón abierto supino',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Movimiento&nbsp; descendente
•&nbsp; Tire&nbsp; de&nbsp; la&nbsp; barra&nbsp; hacia&nbsp; abajo&nbsp; para&nbsp; que&nbsp; pase&nbsp; cerca&nbsp; de&nbsp; su&nbsp; barbilla&nbsp; y&nbsp; toque&nbsp; la&nbsp; parte&nbsp; superior&nbsp;&nbsp;
de&nbsp; su&nbsp; pecho.&nbsp;&nbsp;
•&nbsp; Mantenga&nbsp; el&nbsp; resto&nbsp; de&nbsp; su&nbsp; cuerpo&nbsp; inmóvil.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f1bbbc07-d7ed-44c4-a4e3-9af126fc7c33',
  'Jalón cerrado',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Movimiento&nbsp; descendente

•&nbsp; Tire&nbsp; de&nbsp; la&nbsp; barra&nbsp; hacia&nbsp; abajo&nbsp; para&nbsp; que&nbsp; pase&nbsp; cerca&nbsp; de&nbsp; su&nbsp; barbilla&nbsp; y&nbsp; toque&nbsp; la&nbsp; parte&nbsp; superior&nbsp;&nbsp;
de&nbsp; su&nbsp; pecho.&nbsp;&nbsp;
•&nbsp; Mantenga&nbsp; el&nbsp; resto&nbsp; de&nbsp; su&nbsp; cuerpo&nbsp; inmóvil.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4eb41bfb-cbeb-4683-b9c6-902ee7e028e0',
  'Jalón cerrado supino',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Movimiento&nbsp; descendente
•&nbsp; Tire&nbsp; de&nbsp; la&nbsp; barra&nbsp; hacia&nbsp; abajo&nbsp; para&nbsp; que&nbsp; pase&nbsp; cerca&nbsp; de&nbsp; su&nbsp; barbilla&nbsp; y&nbsp; toque&nbsp; la&nbsp; parte&nbsp; superior&nbsp;&nbsp;
de&nbsp; su&nbsp; pecho.&nbsp;&nbsp;
•&nbsp; Mantenga&nbsp; el&nbsp; resto&nbsp; de&nbsp; su&nbsp; cuerpo&nbsp; inmóvil.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'aa207863-0156-4fa7-919a-cff839ea2418',
  'Curl de biceps con mancuernas sentado',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  'Sujeta dos pesas, los brazos estirados, las manos a los lados, las palmas hacia dentro. Flexiona los brazos y sube el peso con un movimiento rápido. Al mismo tiempo, gira los brazos 90 grados al principio del movimiento. En el punto más alto, gira un poco las pesas hacia fuera. Sin pausa, bájalas lentamente.No permitas que tu cuerpo se balancee durante el ejercicio, todo el trabajo lo realizan los bíceps, que son los únicos músculos que deben moverse (presta atención a los codos).',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9cfde79e-41fe-4180-a1c6-04df42fcbacf',
  'Aperturas en polea',
  'shoulders',
  '[]',
  'other',
  2.5,
  NULL,
  'Este ejercicio trabaja y tensa todo el músculo del pecho. Este entrenamiento de pecho es bueno, pero el equipo generalmente solo se encuentra en gimnasios públicos.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cd376975-6095-4643-bfdd-920bad3c2023',
  'Biceps concentrado martillo (maquina)',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  'Ejecución
1. Realice la posición inicial.
2. Mantenga el agarre firme en todo momento, suba hasta la altura de los hombros, y hasta que ambos brazos queden flexionados. Exhale y contraiga los bíceps.
3. Luego baje lentamente, buscando que sus brazos se encuentren totalmente extendidos. En este punto inhale.
4. Repita las veces que desee.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '19a9f67b-60f5-4367-9134-b805f3e73956',
  'Extensión de gluteos en polea',
  'glutes',
  '[]',
  'other',
  2.5,
  NULL,
  'Esta actividad te permitirá ejercitar la zona del glúteo superior o mayor. Por ello, nunca puede faltar en tu rutina de ejercicios aislados para trabajar los glúteos.

Colócate en frente de una máquina de poleo y localiza el gancho inferior. Luego, sujétalo en las tobilleras para trabajar en polea baja. En relación a la postura, debes estar recto en todo momento. Presta especial atención a tu espalda para mantenerla derecha y no lastimarte.

Es recomendable que te sujetes a la máquina para tener más equilibrio. Con la pierna que estás sosteniendo el peso de la polea, realiza un estiramiento lento para atrás sin flexionar la rodilla.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'ab872d04-ca20-4341-b3c9-76763b25ef42',
  'Extensión de gluteo en  máquina',
  'glutes',
  '[]',
  'other',
  2.5,
  NULL,
  'Un ejercicio de extensión de cadera GHD es uno de los mejores ejercicios para glúteos. Si bien el ejercicio se enfoca principalmente en los glúteos, también es excelente para la zona lumbar, las pantorrillas y los isquiotibiales.',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '710abc6c-40f4-4317-8bb7-6abce242e670',
  'PRESS HORIZONTAL',
  'chest',
  '[]',
  'other',
  2.5,
  NULL,
  'Para realizarlo, debes estirarte sobre un banco plano con los pies en el suelo para facilitar la estabilidad. Sitúa las manos en pronación o semi-pronación (como te sea más cómodo) y realiza el movimiento.',
  'https://wger.de/static/images/muscles/main/muscle-4.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'eaa7927e-6ea0-4fd5-bbcd-525fe90a184b',
  'JALONES PECHO NEUTRO',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  '<p style="">El Jalón al pecho es un ejercicio importante para fortalecer la espalda y mejorar la postura, lo que puede contribuir a una vida más saludable. Para realizar este ejercicio correctamente y evitar lesiones, es importante seguir algunos pasos clave:</p><p style="">1. Colóquese frente a la máquina de poleas con las rodillas ligeramente dobladas y los pies en el suelo.</p><p style="">2. Agarre el mango de la polea con las palmas hacia abajo y las manos separadas a la anchura de los hombros.</p><p style="">3. Tire hacia abajo del mango hasta que toque o se acerque al pecho, manteniendo la posición durante uno o dos segundos.</p><p style="">4. Vuelva a subir el mango lentamente a la posición inicial, asegurándose de mantener los brazos y las manos rectos y la espalda recta durante todo el movimiento.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e87b76b8-2960-4225-9146-47f78bf8c630',
  'PULL OVER POLEA ALTA',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'De pie, de cara al aparato, pies ligeramente separados, barra cogida en pronación, brazos extendidos, manos separadas una distancia igual a Ia anchura de los hombros.

- Espalda fija y la banda abdominal contraída, inspirar y llevar la barra hasta los muslos manteniendo los brazos extendidos. (o los codos ligeramente flexionados).
Espirar al final del movimiento.
',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '4e941b0d-4b2f-4393-89cf-6a5e9b69252e',
  'JALON EN BANCO INCLINADO',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Sobre el banco inclinado frete a la maquina de polea, con el cuerpo boca bajo sobre el banco, se realiza el jalón.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f32a61d0-bef3-4ea8-a296-6a64c7a6ece7',
  'Curl Araña',
  'biceps',
  '[]',
  'other',
  2.5,
  NULL,
  '1). Comience colocando la barra en la parte del banco en la que normalmente se sentaría. Debe asegurarse de alinear la barra correctamente para que no se caiga y esté equilibrada.

2). Muévase a la parte delantera del banco, la parte donde generalmente se encuentran los brazos, y colóquese para recostarse en un ángulo de 45 grados con el estómago y el torso presionados contra la parte delantera del banco.

3). Los pies, y especialmente los dedos de los pies, deben estar bien colocados en el piso. Luego coloque los brazos superiores sobre la almohadilla que se encuentra en la parte interior del banco. La almohadilla superior debe estar ajustada en las axilas.

4). Use sus brazos para agarrar la barra con las palmas hacia arriba, con un poco de ancho de hombro o un poco más cerca. Su agarre para este ejercicio será importante. Sosteniendo las manos juntas, apuntará a la cabeza externa del bíceps, mientras que cuanto más separadas estén las manos, apuntará a la cabeza interna. Puede experimentar haciendo un conjunto de rizos con un agarre más cercano y otro conjunto con un agarre más ancho para asegurarse de golpear ambas cabezas del bíceps.

5). Poco a poco comience a levantar la barra hacia arriba y exhale. Asegúrese de mantener la posición contratada por un segundo y luego apriete los bíceps. Al hacer esto, desea mantener la parte superior de los brazos estacionaria y rizar el peso lo más alto posible.

6). Vuelva a colocar la barra lentamente en la posición inicial y asegúrese de respirar.

7). Haga una breve pausa antes de repetir la cantidad recomendada de repeticiones para su set.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e90cedcc-b179-4ee9-b24c-dc11b49c602f',
  'Gemelos en prensa',
  'calves',
  '[]',
  'other',
  2.5,
  NULL,
  'Sentado sobre el aparato, la parte alta de los muslos apoyada sobre el asiento, la punta de los pies sobre la calza, los tobillos en flexión pasiva:

- Efectuar una extensión de los pies (flexión plantar).',
  'https://wger.de/static/images/muscles/main/muscle-15.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7dd7a735-c1fe-4ca0-a6e8-e825d897b065',
  'Arabesque',
  'hamstrings',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '
  

    

  
  
  Take all your weight onto one&nbsp;leg&nbsp;and you''re going to&nbsp;maintain that position, keeping your hips and pelvis level the whole time. With&nbsp;your back in a neutral position you want to tilt yourself forward kicking your leg back up and then slowly with your glutes bring yourself back up to neutral.
  


  

    

  ',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '78c27d09-223b-4e46-a134-060f9f5c6c74',
  'Curl femoral sentado',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Ajusta la palanca de la máquina para adaptarla a tu altura y siéntate en la máquina con la espalda contra la almohadilla de respaldo.
Coloca los tobillos sobre los cojines , los muslos debajo del cojinete de sujeción justo por encima de las rodillas y las manos en los agarres.Al inspirar realiza una flexión de las rodillas.
Mantener la espalda inmóvil en todo momento únicamente solo debe movilizarse&nbsp; los pies por la flexión de rodilla.
Mantén la posición contraída por un segundo.
Lentamente regresa a la posición inicial. Espirar al final del movimiento.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'deebd257-f84d-4879-9dc4-353ee0ea534f',
  'Back extensión',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Espalda en maquina de extensión con peso',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '636f7aba-518d-49c9-b21d-5e366185ea29',
  'Remo Gironda',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Coloca la polea en el peldaño más bajo de la máquina. Coloque los pies en los soportes disponibles, si no hay soporte, busca un step y colócalo delante de la máquina antes de colocar los pies en ella.

Comienza con los brazos completamente extendidos, ya que este movimiento se dirige a los dorsales y esta posición es la que mejor compromete la zona. Mantén la cabeza, la espalda y la columna vertebral alineadas de forma neutra, con el pecho elevado y el núcleo comprometido. Con una pequeña flexión de las rodillas, tira del accesorio hacia tu cuerpo hasta justo debajo del ombligo, iniciando el movimiento llevando los codos hacia las caderas, manteniendo los codos dentro. Cuando el agarre (accesorio) llegue a tu torso, aprieta los dorsales y los omóplatos, manteniendo la contracción durante 1-2 segundos. Vuelve al principio y repite el número de repeticiones deseado.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '92d508ce-2524-47a3-ac51-1520ccbfd75e',
  'REMO AL MENTON',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'Separamos las piernas a la&nbsp; distancia&nbsp; de&nbsp; los hombros.

Cogemos la barra con agarre&nbsp; &nbsp;Prono, siendo el agarre ancho a la altura de los hombros por lo menos.(explicaremos en los errores comunes el porque de este agarre).
Elevamos la barra hacia el mentón pero sin llegar a tocarlo, aguantamos 1 segundo y volvemos a bajar de forma controlada.
La espalda siempre recta y sin ningún tipo de balanceo corporal.',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '62dcdf81-287a-41cc-ab7e-651044534c5e',
  'Iperestensioni Lombari',
  'glutes',
  '["hamstrings","biceps","back"]',
  'bodyweight',
  2.5,
  NULL,
  'Hyperextensions, also known as back extensions or reverse crunches, are exercises that target the muscles of the lower back, specifically the erector spinae. Here''s how to perform hyperextensions correctly:<ol><li>Lie facedown on a hyperextension bench or a stability ball, positioning your hips at the edge and securing your ankles under the foot pads or having a partner hold them.</li><li>Place your hands behind your head, crossing your arms at the wrists or resting them on your chest.</li><li>Engage your core muscles by drawing your belly button toward your spine.</li><li>Slowly lift your upper body off the bench or ball, focusing on using your lower back muscles to initiate the movement. Keep your neck in a neutral position.</li><li>Continue lifting until your body forms a straight line from your head to your heels.</li><li>Pause briefly at the top of the movement, then slowly lower your upper body back down to the starting position, maintaining control throughout the motion.</li><li>Repeat for the desired number of repetitions, usually 8 to 12.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-8.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6ebb138e-bb0a-402e-84e5-68fe0896e897',
  'Triceps Pushdown',
  'triceps',
  '[]',
  'other',
  2.5,
  NULL,
  'Triceps pushdown on cable using lat bar.
',
  'https://wger.de/static/images/muscles/main/muscle-5.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6b6c69bc-0b1e-4b2f-ab61-4945eb18047e',
  'One Arm Bent Row',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'One arm bent over row on cable with a machine',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cd4c5295-4265-4bc9-8f4f-b0ec5b7483ad',
  'High Pull',
  'back',
  '[]',
  'other',
  2.5,
  NULL,
  'High pull down on cable on machine..',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd36fdd3c-9a35-4643-a3fd-57db78c866d6',
  'Flexión lateral',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'con una pesa en una mano, estiramos el brazo hacia abajo, flexionamos el otro brazo apoyando la mano en la cabeza. Ahora llevamos la mano con la pesa girando el torso arriba y abajo',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '75e2bca9-8d12-4d7f-b27f-a8c6f8be8ded',
  'Abdominales sovieticas',
  'abs',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'sentado en el suelo agarramos la pesa rusa, flexionamos las piernas y las separamos del suelo. Ahora llevaremos a un lado y otro la pesa',
  'https://wger.de/static/images/muscles/main/muscle-6.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '9ce236dc-7704-4f3e-a3d0-4fea382a950b',
  'Curl de biceps con agarre prono',
  'biceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<p style="">POSICIÓN INICIAL:</p><p style="">Seleccione el peso adecuado en una barra. Colóquese de pie con la barra usando un agarre prono y las manos a la anchura de los hombros. Contraiga el suelo pelvico y el core mientras mantiene su pecho levantado.</p><p style="">EJECUCIÓN:</p><p style="">Contrayendo los bíceps, doble los codos totalmente mientras exhala. Vuelva a la posición inicial con un suave movimiento mientras inhala.</p>',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '3e2adb27-49ac-42ac-90e3-43bcef160bb4',
  'Bulgarian Split Squats',
  'hamstrings',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Benefits of the Bulgarian split squat abound. As a lower body exercise, it strengthens the muscles of the legs, including the quads, hamstrings, glutes, and calves. Also, as a single-leg exercise, your core is forced to work in overdrive to maintain your balance.',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '94238bef-15ee-42b6-8035-79854b3c6e65',
  'Curl de biceps alterno',
  'biceps',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Con una mancuerna en cada mano, vamos a realizar movimientos alternos de llevar la mancuerna hacia arriba.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '10510fb5-6ebd-4ddc-b03e-423b15deceea',
  'Russian Twist',
  'back',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<ol><li>&nbsp;Hold a dumbbell, barbell weight or something else that is heavy with both hands, but make sure it is not too heavy and you are able to keep in form.</li><li>Lean back to a 45-degree angle from the floor. For an extra challenge, lift your feet off the floor.</li><li>Rotate your arms to one side to the same level as your chest, touch the floor for a little extra challenge, and then do the same to the other side. When you''re back in your original position after doing both sides it will count as 1 rep.</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-12.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e56f2970-e4c9-45eb-8e8c-52abb590e7a6',
  'PALLOF PRESS',
  'shoulders',
  '["chest","triceps"]',
  'other',
  2.5,
  NULL,
  'The Pallof press is an anti-rotation exercise that trains the larger and smaller muscles around the spine to resist rotation.<ul><li>Stand parallel to the cable machine or to the anchor point to the 
resistance band and clasp with the handle or band with both hands.</li><li>Make sure your torso is front on and bring your hands to the center of your chest and slowly press out.</li><li>Slowly return your hands to the chest and repeat.</li></ul>',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'cd7bbafc-4092-4194-aa20-e380f1fe45f0',
  'Side Slides + Squats',
  'quadriceps',
  '["calves","glutes"]',
  'bodyweight',
  2.5,
  NULL,
  'With feet a little wider than shoulder-width apart and staying low to mimic a defensive position, you should step with their lead leg and push off with their plant leg.
After three slides, rotate your body for 180 degree on the guiding (/outer) leg and do a squat. Continue.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '36a309ba-7dd1-43c9-9efc-788c7cd9fbd6',
  'Wall Drills',
  'quadriceps',
  '["calves"]',
  'bodyweight',
  2.5,
  NULL,
  'Exercises for strengthening knee and leg musculature.<ul><li>Lateral Wall Drills March - https://youtu.be/9RiTlJ6Mmek</li><li>Lateral Wall Drills OPEN - https://youtu.be/ADRlN8-Wfdg</li><li>Lateral Wall Drills CROSS - https://youtu.be/hGH2sj0Tzu4</li></ul>',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8d56eb18-b000-41ff-8b31-c74df3a4b34b',
  'Inverted Rows',
  'biceps',
  '["chest","abs","traps"]',
  'bodyweight',
  2.5,
  NULL,
  'Maintain a straight body, retract your shoulder blades, and pull your 
chest to the bar for an effective back and upper body workout.',
  'https://wger.de/static/images/muscles/main/muscle-1.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6112a068-d4a7-4af3-8dcb-f45253d6787b',
  'Adduktorenmaschine',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Hinsetzen, Beine in die Auflage legen/gegen die Polster drücken, Beine zusammendrücken bis die Auflagen aneinander stoßen',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f5252fbe-1e00-4b8d-8781-2e56d6a5250f',
  'Elevación tibial anterior',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Pararse derecho</li><li>Levantar la punta de los pies, apoyándose sobre el talón. </li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '8c132ea0-7885-474f-8514-0909ae22bdf6',
  'Dragon squat',
  'quadriceps',
  '["hamstrings","calves","glutes"]',
  'bodyweight',
  2.5,
  NULL,
  'Comienza parado con los pies al ancho de las caderas. Cruza el pie derecho detrás de ti a la esquina izquierda y parte posterior de la sala mientras doblas ambas rodillas. Regresa y repite alternando los lados. Mantén las caderas y los hombros hacia adelante cuando cruzas los pies y doblas las rodillas.',
  'https://wger.de/static/images/muscles/main/muscle-10.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '7212cc74-656e-47ce-8292-d211676f2ee1',
  'Side Lying Hip Abduction',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ul><li>Begin by lying down on your side with your top leg straight and your bottom leg bent for support.&nbsp;&nbsp;</li><li>Lift your top leg off the ground</li><li><i>(optional) - </i>Hold position at the top</li></ul>
Resources:<ul><li>40 seconds YouTube video: https://www.youtube.com/watch?v=g9FtnmsIYgI</li></ul>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'db4eaf0f-f4d4-4e63-b9fb-258985bc2858',
  'Calf raises, left leg',
  'calves',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<ol><li>Stand on the floor or on the edge of a step to increase the range of movement.&nbsp;</li><li>Raise one foot.</li><li>Lift your heel until you''re standing on your toes.</li><li><i>(variable) </i>Stay in this position for three seconds</li><li>Slowly lower your foot until you almost touch the ground with your heel - don''t slam your foot!</li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-7.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '517265a2-e4f7-4b33-979f-9be1efd86343',
  'Cycling cardio session',
  'other',
  '[]',
  'other',
  2.5,
  NULL,
  'Sessió de càrdio en bicicleta estàtica Technogym Bike Excite 1000',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '2cc92db8-b245-44b8-b1d6-bf91c78c2ab9',
  'Wrist curl, dumbbells',
  'other',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  '<ol><li>Sitting on a bench, grab the dumbbell with your palms facing up 
and your hands shoulder-width apart. Rest your forearms on your thighs 
and allow your wrists to hang over your knees.&nbsp;</li><li>Perform the movement by 
curling your palms and wrists towards your face.</li><li>(optional/variable) Pause at the top.&nbsp;</li><li>Slowly return to the starting position.</li></ol>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '6f0d5766-05ac-41b5-a592-7036ac99ee49',
  'scorpion kick',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Start in a plank position with hands under your shoulders and your body in a straight line.

Slowly lift your legs by bending your knees, aiming to bring your feet over your back while raising your hips.

Engage your core muscles for stability, trying to bring your feet towards your head.

Hold this position briefly before slowly and controlledly bringing your legs back to the starting position.

Repeat the movement slowly and steadily for the desired number of repetitions, ensuring to maintain form and avoid injuries.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '89651d40-9abf-49b5-9ee5-7b0ecb25fd03',
  'Scorpion Kick',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  '<b>Get into the push-up position with your shoulders directly above your hands and your feet hip-width apart.&nbsp;</b>
<b></b>
<b>Make sure that your body forms a straight line from your head to your heels.&nbsp;</b>
<b></b>
<b>Now pull your right knee towards your chest. While keeping your knee bent, lift your right leg as high as possible with your lower right leg pointing straight up.&nbsp;</b>
<b></b>
<b>Now rotate your hips so that your right foot swings over your left leg.&nbsp;</b>
<b></b>
<b>Continue to rotate and move your right foot towards the floor until you are forced to roll onto the outside of your left standing foot. Make sure that you do not rotate your upper body.&nbsp;</b>
<b></b>
<b>Now return to the starting position and repeat the exercise with your right leg.</b>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'f9866335-e489-404b-84b5-248fb8512702',
  'Prisoner Squat',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Stand upright with your chest slightly raised, your feet hip-width apart and your toes pointing straight ahead.

Bring your hands to the back of your head with your fingers slightly interlaced and your elbows pointing to the side. Push your hips back and bend your knees, keeping your upper body as upright as possible.&nbsp;

Push your knees outwards, they must never point towards each other. If your upper body moves slightly forward, make sure that it does not bend. Always keep your elbows level with your ears by tensing the muscles between your shoulder blades. If you are flexible enough, you can sink down until your buttocks touch your calves.
However, make sure that you do not bend your spine.&nbsp;

Before this happens, reverse the movement and use your heels and glutes to push yourself upwards with so much momentum that your feet lift off briefly and you do a little hop.&nbsp;

If necessary, correct the position of your feet, arms and upper body before you move on to the next repetition.

Translated with www.DeepL.com/Translator (free version)',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '716286dd-05b1-4f87-8b3b-a0c559bcafc4',
  'Shoulder width three-point push-up',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Get into a push-up position with your shoulders directly above your hands and your feet hip-width apart. Draw your belly button in towards your spine and tighten your abdominal muscles. Lift your left foot about five centimetres off the floor. Point your toes straight down. Do not move your hips. Your body forms a straight line from your head to your heels throughout the exercise. Now bend your elbows, lower your chest to the floor and push yourself back up. Repeat the exercise on the other side.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '965b0d80-544b-4f22-a64b-32dc033f071a',
  'Skydiver with arms in T-position',
  'other',
  '[]',
  'bodyweight',
  2.5,
  NULL,
  'Lie on your stomach with your legs more than shoulder-width apart and your feet up. Your arms are stretched out to the side and form a T with your upper body, your palms are on the floor. Now raise your upper body, arms and legs as high as you can while keeping your body under tension. Turn your thumbs towards the ceiling and pull your shoulder blades together. While keeping your upper body and all limbs in the air, bring your legs together and then spread them again, keeping them constantly in the air. For the remaining repetitions, only move your legs open and closed.',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'a3125129-203f-4195-8f8a-a460ff9e9481',
  'Romanian deadlift, single leg',
  'hamstrings',
  '[]',
  'dumbbell',
  2.5,
  NULL,
  'Also known as: &nbsp;RDL.

Steps:
<ol><li></li></ol>',
  'https://wger.de/static/images/muscles/main/muscle-11.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  '1bccba58-1639-4e5c-8a33-0d595aa41a7c',
  'Bauchtrainer',
  'other',
  '["abs"]',
  'other',
  2.5,
  NULL,
  '<b>EGYM Smart Strength Bauchmaschine</b>',
  NULL
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'd05a86fd-5699-4655-bec1-9ffbd5a6ef4b',
  'Trazioni orizzontali',
  'shoulders',
  '["biceps"]',
  'bodyweight',
  2.5,
  NULL,
  'Le trazioni orizzontali agiscono <b>principalmente sui muscoli della schiena</b>,
 mentre le trazioni lavorano maggiormente sui muscoli della parte 
superiore della schiena e delle braccia. Combinando questi due esercizi 
si ottiene un allenamento più completo per i muscoli della schiena e 
delle braccia.',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  'e79616cb-f5fb-4b10-b99d-09d43774e142',
  'Front lever tuck',
  'shoulders',
  '["triceps"]',
  'bodyweight',
  2.5,
  NULL,
  'I muscoli coinvolti nel Front Lever, maggiormente sottoposti a sforzo, sono principalmente&nbsp;gli estensori quali: il gran dorsale, il grande rotondo, il deltoide posteriore e il capolungo del bicipite',
  'https://wger.de/static/images/muscles/main/muscle-2.svg'
);
COMMIT;
