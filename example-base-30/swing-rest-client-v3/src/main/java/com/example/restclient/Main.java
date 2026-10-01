package com.example.restclient;
import javax.swing.SwingUtilities;
public class Main { public static void main(String[] args){ SwingUtilities.invokeLater(()->new RestClientFrame().setVisible(true)); } }