# Code Convention Rules

This comprehensive guide outlines best practices, conventions, and standards for development with modern web technologies including React and Next.js, Typescript, TailwindCSS, shadcn/ui, Radix UI, Tanstack React Query, Tolgee, Sentry, Firebase and Framer Motion.
 
## Basic code conventions

- Named useEffect functions: The function inside a useEffect must not be anonymous; it should have a name.
- Custom hooks must not accept parameters.
- Avoid placing useEffect inside custom hooks.
- Do not explicitly type the return value of custom hooks.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Hooks must be documented, except for obvious cases.
- Components must be written as arrow functions.
- Avoid default exports for components.
- Avoid multiple nested ternary operators.
- Inferred types should not be explicitly typed.
- Use async/await instead of .then().catch().
- Follow Object Calisthenics principles when using if/else.
- Define one file per component or custom hook; avoid multiple components or logics in a single file.
- All comments must be written in English.
- Prefer iteration and modularization over code duplication.
- Do not include the 'import React from "react";' since it is not necessary
- Whenever you add UI with text, if the project has Tolgee installed, use it, and always include the key and the second parameter with the text. For example: t('sign-in.title', 'Iniciar sesión'). The second parameter always write it IN SPANISH 
- Never add translations to the JSON translations files. Tolgee automatically add them.

## Code Formatting Rules and Conventions

All hooks, states, references, and other elements must be declared in the following order (unless dependencies require a different structure). Use the exact comments provided—do not add unnecessary details.
Only write the comment if there is code for that section. In case there is no useState used in the component, do not include the comment '// State'

```
// Types
interface ComponentProps {
    min: number;
    max: number;
}

export const Component = ({min, max}: ComponentProps) => {
    // Third party hooks
    const router = useRouter();

    // Custom hooks
    const debouncedValue = useDebouncedValue();

    // Data fetching
    const userExams = useGetUserExams();

    // State
    const [value, setValue] = useState(0);

    // Refs
    const elementRef = useRef();

    // Helpers / Functions
    const getIsUserMale = (gender: string) => {};

    // Effects
    useEffect(function foo() {
        // Some logic
    }, []);

    // Constants
    const MIN_VALUE = 14;
    const isUserExercising = false;

    // Conditional rendering
    if (!isUserLoaded) return <></>;

    return (
        <div>
            <h1>Component</h1>
        </div>
    );
};
```

## Error Handling and Validation

- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Utilize guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Use custom error types or factories for consistent error handling.

## Performance Optimization

- Optimize for both web and mobile performance.
- Use dynamic imports for code splitting in Next.js.
- Implement lazy loading for non-critical components.
- Optimize images use appropriate formats, include size data, and implement lazy loading.

## Output Expectations

- Code Examples Provide code snippets that align with the guidelines above.
- Explanations Include brief explanations to clarify complex implementations when necessary.
- Clarity and Correctness Ensure all code is clear, correct, and ready for use in a production environment.
- Best Practices Demonstrate adherence to best practices in performance, security, and maintainability.
