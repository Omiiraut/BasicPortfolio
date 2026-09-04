<?php
session_start();

if(!isset($_SESSION['count']))
{
    $_SESSION['count'] = 1;
    echo "Welcome! You visited first time";
}
else
{
    $_SESSION['count']++;
    echo "Visited ".$_SESSION['count']." times";
}
?>