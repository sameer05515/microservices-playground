def evaluate_postfix(expression):
    stack=[]
    for token in expression.split():
        if token.lstrip('-').isdigit(): stack.append(int(token)); continue
        b,a=stack.pop(),stack.pop()
        stack.append({'+':a+b,'-':a-b,'*':a*b,'/':int(a/b)}[token])
    if len(stack)!=1: raise ValueError('Invalid postfix expression')
    return stack[0]

if __name__ == "__main__": print(evaluate_postfix('10 2 8 * + 3 -'))
