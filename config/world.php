<?php

return [
    'transport' => 500,//Capacidad de transporte de barcos mercantes
    'load_speed' => 5000,//Carga base del puerto
    'load_attack_return' => 5,//Tiempo que demora en cargar los recursos de un saqueo
    'load_defend_return' => 5,//Tiempo que demora en cargar las tropas al regresar de una defensa
    'resource_protected' => 100,//Capacidad base de proteccion de recursos
    'warehouse' => [
        'resource_protected' => 400,//Capacidad de recursos protegidos por nivel de deposito
    ],
    'distance' => [
        'same_island' => 5
    ],
    'combat' => [
        'wall_bonus' => 0.01 //Bonus de la muralla por nivel 0.01 es 1%
    ]
];
