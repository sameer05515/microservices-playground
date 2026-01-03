package com.p.exceptionhandling.validation;

import java.util.regex.Pattern;

/**
 * Email Validator Utility
 * 
 * This provides email validation logic that can be used
 * throughout the application. It's separated from the exception
 * to allow reuse in different contexts.
 */
public class EmailValidator {
	
	private static final String EMAIL_PATTERN =
		"^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@" +
		"(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
	
	private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);
	
	/**
	 * Validate email format
	 * 
	 * @param email email to validate
	 * @return true if valid, false otherwise
	 */
	public static boolean isValid(String email) {
		if (email == null || email.trim().isEmpty()) {
			return false;
		}
		return pattern.matcher(email).matches();
	}
	
	/**
	 * Get validation error message
	 */
	public static String getValidationMessage(String email) {
		if (email == null || email.trim().isEmpty()) {
			return "Email cannot be empty";
		}
		if (!email.contains("@")) {
			return "Email must contain @ symbol";
		}
		if (email.indexOf("@") != email.lastIndexOf("@")) {
			return "Email must contain exactly one @ symbol";
		}
		String[] parts = email.split("@");
		if (parts.length != 2) {
			return "Email format is invalid";
		}
		if (parts[0].isEmpty()) {
			return "Email local part cannot be empty";
		}
		if (parts[1].isEmpty() || !parts[1].contains(".")) {
			return "Email domain must contain a dot";
		}
		return "Email format is invalid";
	}
}

