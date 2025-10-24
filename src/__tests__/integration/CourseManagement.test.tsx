// TESTE DE INTEGRAÇÃO - Gerenciamento de Disciplinas (ATUALIZADO)
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock do gerenciamento de disciplinas
const CourseManagement = () => {
  const [courses, setCourses] = React.useState<Array<{
    id: string;
    name: string;
    code: string;
    professor: string;
    vacancies: number;
    enrolled: number;
    description: string;
  }>>([]);

  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    // Mock de carregamento inicial
    setCourses([
      { 
        id: '1', 
        name: 'Matemática Avançada', 
        code: 'MAT101', 
        professor: 'Prof. João Silva', 
        vacancies: 30, 
        enrolled: 25,
        description: 'Disciplina de matemática para graduação'
      },
      { 
        id: '2', 
        name: 'Programação Web', 
        code: 'PROG201', 
        professor: 'Prof. Ana Santos', 
        vacancies: 25, 
        enrolled: 20,
        description: 'Desenvolvimento web com React e Node.js'
      },
    ]);
  }, []);

  const handleAddCourse = (courseData: { 
    name: string; 
    code: string; 
    professor: string; 
    vacancies: number;
    description: string;
  }) => {
    const newCourse = {
      id: Date.now().toString(),
      ...courseData,
      enrolled: 0,
    };
    setCourses(prev => [...prev, newCourse]);
    setShowForm(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const handleEnrollStudent = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId && course.enrolled < course.vacancies
        ? { ...course, enrolled: course.enrolled + 1 }
        : course
    ));
  };

  return (
    <div data-testid="course-management">
      <h2>Gerenciamento de Disciplinas Acadêmicas</h2>
      
      <button 
        onClick={() => setShowForm(true)}
        data-testid="add-course-button"
      >
        Nova Disciplina
      </button>

      {showForm && (
        <CourseForm 
          onSubmit={handleAddCourse}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div data-testid="courses-list">
        <h3>Disciplinas Cadastradas</h3>
        {courses.length === 0 ? (
          <p data-testid="no-courses">Nenhuma disciplina cadastrada</p>
        ) : (
          courses.map(course => (
            <div key={course.id} data-testid={`course-${course.id}`} className="course-card">
              <div>
                <h4 data-testid="course-name">{course.name}</h4>
                <span data-testid="course-code">Código: {course.code}</span>
                <span data-testid="course-professor">Professor: {course.professor}</span>
                <span data-testid="course-description">Descrição: {course.description}</span>
                <span data-testid="course-vacancies">
                  Matriculados: {course.enrolled}/{course.vacancies}
                </span>
                <div data-testid="course-actions">
                  <button 
                    onClick={() => handleEnrollStudent(course.id)}
                    disabled={course.enrolled >= course.vacancies}
                    data-testid={`enroll-${course.id}`}
                  >
                    {course.enrolled >= course.vacancies ? 'Turma Lotada' : 'Matricular Aluno'}
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    data-testid={`delete-${course.id}`}
                  >
                    Excluir Disciplina
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Mock do CourseForm (versão simplificada para integração)
const CourseForm = ({ onSubmit, onCancel }: any) => {
  const [formData, setFormData] = React.useState({
    name: '',
    code: '',
    professor: '',
    vacancies: 30,
    description: '',
  });

  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.code.trim()) newErrors.code = 'Código é obrigatório';
    if (!formData.professor.trim()) newErrors.professor = 'Professor é obrigatório';
    if (formData.vacancies <= 0) newErrors.vacancies = 'Vagas devem ser positivas';

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="course-form">
      <div>
        <label htmlFor="name">Nome da disciplina:</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          data-testid="name-input"
        />
        {errors.name && <span data-testid="name-error">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="code">Código:</label>
        <input
          id="code"
          type="text"
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
          data-testid="code-input"
        />
        {errors.code && <span data-testid="code-error">{errors.code}</span>}
      </div>

      <div>
        <label htmlFor="professor">Professor:</label>
        <input
          id="professor"
          type="text"
          value={formData.professor}
          onChange={(e) => setFormData(prev => ({ ...prev, professor: e.target.value }))}
          data-testid="professor-input"
        />
        {errors.professor && <span data-testid="professor-error">{errors.professor}</span>}
      </div>

      <div>
        <label htmlFor="vacancies">Vagas:</label>
        <input
          id="vacancies"
          type="number"
          value={formData.vacancies}
          onChange={(e) => setFormData(prev => ({ ...prev, vacancies: parseInt(e.target.value) || 0 }))}
          data-testid="vacancies-input"
        />
        {errors.vacancies && <span data-testid="vacancies-error">{errors.vacancies}</span>}
      </div>

      <div>
        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          data-testid="description-textarea"
        />
      </div>

      <div>
        <button type="submit" data-testid="submit-button">Salvar Disciplina</button>
        <button type="button" onClick={onCancel} data-testid="cancel-button">Cancelar</button>
      </div>
    </form>
  );
};

describe('Integração - Gerenciamento de Disciplinas Acadêmicas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve carregar disciplinas iniciais', async () => {
    render(<CourseManagement />);

    await waitFor(() => {
      expect(screen.getByTestId('course-1')).toBeInTheDocument();
      expect(screen.getByTestId('course-2')).toBeInTheDocument();
      expect(screen.getByTestId('course-name')).toHaveTextContent('Matemática Avançada');
      expect(screen.getByTestId('course-code')).toHaveTextContent('MAT101');
    });
  });

  test('deve cadastrar nova disciplina', async () => {
    const user = userEvent.setup();
    render(<CourseManagement />);

    // Clicar para adicionar nova disciplina
    const addButton = screen.getByTestId('add-course-button');
    await user.click(addButton);

    // Preencher formulário
    const nameInput = screen.getByTestId('name-input');
    const codeInput = screen.getByTestId('code-input');
    const professorInput = screen.getByTestId('professor-input');
    const vacanciesInput = screen.getByTestId('vacancies-input');
    const descriptionInput = screen.getByTestId('description-textarea');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(nameInput, 'Banco de Dados');
    await user.type(codeInput, 'BD301');
    await user.type(professorInput, 'Prof. Carlos Lima');
    await user.clear(vacanciesInput);
    await user.type(vacanciesInput, '40');
    await user.type(descriptionInput, 'Fundamentos de bancos de dados relacionais');
    await user.click(submitButton);

    // Verificar se disciplina foi adicionada
    await waitFor(() => {
      expect(screen.getByTestId('course-name')).toHaveTextContent('Banco de Dados');
      expect(screen.getByTestId('course-code')).toHaveTextContent('BD301');
      expect(screen.getByTestId('course-professor')).toHaveTextContent('Prof. Carlos Lima');
    });
  });

  test('deve validar campos obrigatórios do formulário', async () => {
    const user = userEvent.setup();
    render(<CourseManagement />);

    const addButton = screen.getByTestId('add-course-button');
    await user.click(addButton);

    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Nome é obrigatório');
      expect(screen.getByTestId('code-error')).toHaveTextContent('Código é obrigatório');
      expect(screen.getByTestId('professor-error')).toHaveTextContent('Professor é obrigatório');
    });
  });

  test('deve matricular aluno em disciplina com vagas', async () => {
    const user = userEvent.setup();
    render(<CourseManagement />);

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByTestId('course-1')).toBeInTheDocument();
    });

    // Verificar estado inicial
    expect(screen.getByTestId('course-vacancies')).toHaveTextContent('25/30');

    // Matricular aluno
    const enrollButton = screen.getByTestId('enroll-1');
    await user.click(enrollButton);

    // Verificar se matrícula foi realizada
    await waitFor(() => {
      expect(screen.getByTestId('course-vacancies')).toHaveTextContent('26/30');
    });
  });

  test('deve excluir disciplina', async () => {
    const user = userEvent.setup();
    render(<CourseManagement />);

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByTestId('course-1')).toBeInTheDocument();
    });

    // Excluir disciplina
    const deleteButton = screen.getByTestId('delete-1');
    await user.click(deleteButton);

    // Verificar se disciplina foi removida
    await waitFor(() => {
      expect(screen.queryByTestId('course-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('course-2')).toBeInTheDocument(); // A outra deve permanecer
    });
  });
});