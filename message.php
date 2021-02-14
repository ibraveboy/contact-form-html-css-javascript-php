<?php

function isValidJSON($str) {
   json_decode($str);
   return json_last_error() == JSON_ERROR_NONE;
}

$json_params = file_get_contents("php://input");

if (strlen($json_params) > 0 && isValidJSON($json_params)) {
  $decoded_params = json_decode($json_params, true);
  if (empty($decoded_params["fullName"]) && empty($decoded_params["phone"])) {
    exit(json_encode(array("status" => "failed", "message" => "Required fields are missing.")));
  }
  $subject = 'Job Application Form';
  $full_name = $decoded_params["fullName"];
  $phone = $decoded_params["phone"];
  $to = $decoded_params["to"];
  $address = '';
  $qualification = '';
  $apply = '';
  if (!empty($decoded_params["address"])) {
    $address = $decoded_params["address"];
  }
  if (!empty($decoded_params["education"])) {
    $qualification = $decoded_params["education"];
  }
  if (!empty($decoded_params["applyFor"])) {
    $apply = $decoded_params["applyFor"];
  }
  $message = "Full Name: $full_name \n Phone Number: $phone \n Address: $address \n Qualification: $qualification \n Appying For: $apply";
  $result = mail($decoded_params["to"],$subject, $message);
  if ($result) {
    exit(json_encode(array("status" => "success", "message" => "Email sent successfully.")));
  } else {
    exit(json_encode(array("status" => "failed", "message" => "Email was not sent. Please try again.")));
  }
} else {
  exit(json_encode(array("status" => "failed", "message" => "Something went wrong.")));
}

?>