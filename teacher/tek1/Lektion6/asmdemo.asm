; Demo 1 Hello world!

section .data
    msg db "Hello world!", 0ah

section .text
    global _start

_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, 13
    syscall
    mov rax, 60
    mov rdi, 0
    syscall


; Demo 2 læg tal sammen
section .text
    global _start

_start:
    mov rax, 5      ; first number
    mov rbx, 3      ; second number

    add rax, rbx    ; rax = rax + rbx  (5 + 3 = 8)

    mov rdi, rax    ; exit code = result (8)
    mov rax, 60     ; syscall: exit
    syscall



; Demo 3 Loop
section .text
    global _start

_start:
    mov rcx, 5      ; counter = 5

loop_start:
    dec rcx         ; rcx = rcx - 1
    cmp rcx, 0      ; compare rcx with 0
    jne loop_start  ; jump if not equal (rcx != 0)

    mov rax, 60     ; exit
    mov rdi, 0
    syscall

; Demo 4 funktion
section .text
    global _start

_start:
    mov rdi, 7      ; first argument
    mov rsi, 4      ; second argument

    call add_numbers

    mov rdi, rax    ; exit with result
    mov rax, 60
    syscall

add_numbers:
    mov rax, rdi    ; rax = first argument
    add rax, rsi    ; rax = rax + second argument
    ret
