package com.example.jarttoexe;
import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
public class Main {
  static JTextField jar,name,main,icon,out;
  static JTextArea log;
  static void choose(JTextField f, boolean dir){
    JFileChooser c=new JFileChooser(); c.setFileSelectionMode(dir?JFileChooser.DIRECTORIES_ONLY:JFileChooser.FILES_ONLY);
    if(c.showOpenDialog(null)==JFileChooser.APPROVE_OPTION) f.setText(c.getSelectedFile().getAbsolutePath());
  }
  static void addRow(JPanel p, GridBagConstraints g, int y,String label,JTextField f,JButton b){
    g.gridy=y; g.gridx=0; g.weightx=0; p.add(new JLabel(label),g);
    g.gridx=1; g.weightx=1; p.add(f,g); g.gridx=2; g.weightx=0; p.add(b,g);
  }
  public static void main(String[] a){
    SwingUtilities.invokeLater(()->{
      JFrame x=new JFrame("JAR → EXE Builder V1"); x.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
      JPanel p=new JPanel(new GridBagLayout()); GridBagConstraints g=new GridBagConstraints(); g.insets=new Insets(6,6,6,6); g.fill=GridBagConstraints.HORIZONTAL;
      jar=new JTextField(); name=new JTextField("My Java Application"); main=new JTextField(); icon=new JTextField(); out=new JTextField("dist");
      addRow(p,g,0,"JAR file",jar,b("Browse",e->choose(jar,false)));
      addRow(p,g,1,"Application",name,b("",""));
      addRow(p,g,2,"Main class",main,b("Detect",e->detect()));
      addRow(p,g,3,"Icon (.ico)",icon,b("Browse",e->choose(icon,false)));
      addRow(p,g,4,"Output folder",out,b("Browse",e->choose(out,true)));
      JPanel opts=new JPanel(new FlowLayout(FlowLayout.LEFT)); JCheckBox menu=new JCheckBox("Start Menu",true), desk=new JCheckBox("Desktop",true); opts.add(menu);opts.add(desk);
      g.gridy=5;g.gridx=0;g.gridwidth=3;p.add(opts,g);
      JPanel actions=new JPanel(); JButton show=b("Show Command",e->command()), build=b("Build EXE",e->build(menu.isSelected(),desk.isSelected())); actions.add(show);actions.add(build);
      g.gridy=6;p.add(actions,g);
      log=new JTextArea(12,70);log.setEditable(false);g.gridy=7;p.add(new JScrollPane(log),g);
      x.add(p);x.pack();x.setLocationRelativeTo(null);x.setVisible(true);
    });
  }
  static JButton b(String s, java.awt.event.ActionListener l){ JButton b=new JButton(s); if(l!=null)b.addActionListener(l); return b; }
  static void detect(){ try(var z=new java.util.jar.JarFile(jar.getText())){var a=z.getManifest(); if(a!=null){String m=a.getMainAttributes().getValue("Main-Class"); if(m!=null)main.setText(m); else log.append("Main-Class not found in manifest.\n");}}catch(Exception e){log.append("Detect error: "+e+"\n");}}
  static String command(){
    List<String> c=new ArrayList<>(List.of("jpackage","--type","exe","--name",name.getText(),"--input",new File(jar.getText()).getParent(),"--main-jar",new File(jar.getText()).getName(),"--main-class",main.getText(),"--dest",out.getText(),"--win-menu","--win-shortcut"));
    if(!icon.getText().isBlank())c.addAll(List.of("--icon",icon.getText())); return String.join(" ",c);
  }
  static void build(boolean menu,boolean desk){
    new Thread(()->{try{
      Files.createDirectories(Path.of(out.getText()));
      List<String> c=new ArrayList<>(List.of("jpackage","--type","exe","--name",name.getText(),"--input",new File(jar.getText()).getParent(),"--main-jar",new File(jar.getText()).getName(),"--main-class",main.getText(),"--dest",out.getText()));
      if(menu)c.add("--win-menu"); if(desk)c.add("--win-shortcut"); if(!icon.getText().isBlank())c.addAll(List.of("--icon",icon.getText()));
      log.append("> "+String.join(" ",c)+"\n");
      Process p=new ProcessBuilder(c).redirectErrorStream(true).start(); try(var r=p.inputReader()){r.lines().forEach(s->SwingUtilities.invokeLater(()->log.append(s+"\n")));} int code=p.waitFor();
      log.append("Build finished. Exit code: "+code+"\n");
    }catch(Exception e){log.append("Build error: "+e+"\n");}}).start();
  }
}