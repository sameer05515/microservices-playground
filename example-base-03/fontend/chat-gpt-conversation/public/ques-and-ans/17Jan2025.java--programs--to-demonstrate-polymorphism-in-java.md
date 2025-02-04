Here’s a simple Java program demonstrating **polymorphism**, including both **compile-time polymorphism (method overloading)** and **runtime polymorphism (method overriding)**:

---

### **Program: Polymorphism Example**

```java
// Compile-time Polymorphism (Method Overloading)
class Calculator {
    // Overloaded method for addition with two integers
    public int add(int a, int b) {
        return a + b;
    }

    // Overloaded method for addition with three integers
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Overloaded method for addition with two doubles
    public double add(double a, double b) {
        return a + b;
    }
}

// Runtime Polymorphism (Method Overriding)
class Animal {
    // Method to be overridden by subclasses
    public void makeSound() {
        System.out.println("Some generic animal sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof! Woof!");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow! Meow!");
    }
}

public class PolymorphismDemo {
    public static void main(String[] args) {
        // Demonstrate Compile-time Polymorphism
        Calculator calculator = new Calculator();
        System.out.println("Addition of two integers: " + calculator.add(5, 10));
        System.out.println("Addition of three integers: " + calculator.add(1, 2, 3));
        System.out.println("Addition of two doubles: " + calculator.add(5.5, 2.5));

        System.out.println("\n--- Runtime Polymorphism ---");

        // Demonstrate Runtime Polymorphism
        Animal myAnimal;

        // Dog instance
        myAnimal = new Dog();
        myAnimal.makeSound();

        // Cat instance
        myAnimal = new Cat();
        myAnimal.makeSound();

        // General Animal instance
        myAnimal = new Animal();
        myAnimal.makeSound();
    }
}
```

---

### **Explanation**

1. **Compile-time Polymorphism (Method Overloading):**
   - The `Calculator` class has multiple `add` methods with the same name but different parameter lists.
   - The correct method is determined at compile-time based on the arguments passed.

2. **Runtime Polymorphism (Method Overriding):**
   - The `Animal` class has a `makeSound` method, which is overridden by the `Dog` and `Cat` subclasses.
   - At runtime, the method call is resolved to the subclass implementation based on the actual object type assigned to the `Animal` reference.

---

### **Output**

```
Addition of two integers: 15
Addition of three integers: 6
Addition of two doubles: 8.0

--- Runtime Polymorphism ---
Woof! Woof!
Meow! Meow!
Some generic animal sound
``` 

This program showcases both types of polymorphism, making it a comprehensive example for understanding the concept.