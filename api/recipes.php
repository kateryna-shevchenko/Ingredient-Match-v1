<?php
header("Content-Type: application/json");
$raw = file_get_contents("php://input");
$ingredients = json_decode($raw, true);
echo json_encode(["recipes" => ["Omelete with eggs"]]);
