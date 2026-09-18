package com.prem.anagram;
import java.util.concurrent.*;
public class ExecutorServiceDemo {public static int runTasks() throws Exception {ExecutorService executor=Executors.newFixedThreadPool(2);try{Future<Integer>a=executor.submit(()->10);Future<Integer>b=executor.submit(()->20);return a.get()+b.get();}finally{executor.shutdown();}}}
