import type { Student, AnalysisResult, AuthStudent, AuthResponse } from '~/types'

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: 'Ademide Jane',
    email: 'ademide@example.com',
    matricNo: 'CSC/2022/089',
    grades: [
      { courseCode: 'CSC101', subject: 'Programming Fundamentals', score: 85, semester: 'Fall 2025', units: 3 },
      { courseCode: 'MTH112', subject: 'Calculus II', score: 78, semester: 'Fall 2025', units: 4 },
      { courseCode: 'PHY110', subject: 'Physics for Engineers', score: 62, semester: 'Fall 2025', units: 3 },
      { courseCode: 'ENG105', subject: 'Academic Writing', score: 72, semester: 'Fall 2025', units: 2 },
      { courseCode: 'HIS120', subject: 'Modern History', score: 45, semester: 'Spring 2026', units: 2 },
    ]
  },
  {
    id: 2,
    name: 'Babatunde Caleb',
    email: 'caleb@example.com',
    matricNo: 'MTH/2022/012',
    grades: [
      { courseCode: 'MTH111', subject: 'Algebra', score: 92, semester: 'Fall 2025', units: 3 },
      { courseCode: 'ENG105', subject: 'Academic Writing', score: 81, semester: 'Fall 2025', units: 2 },
    ]
  }
]

const INITIAL_USERS = [
  { email: 'student@example.com', username: 'ademide.jane', password: 'password' },
  { email: 'ademide@example.com', username: 'ademide.jane', password: 'password' }
]

// Grade point calculations helper
const getGradePoints = (score: number): number => {
  if (score >= 80) return 4.0 // A
  if (score >= 70) return 3.0 // B
  if (score >= 60) return 2.0 // C
  if (score >= 50) return 1.0 // D
  return 0.0 // F
}

const getGradeSymbol = (score: number): string => {
  if (score >= 85) return 'A'
  if (score >= 80) return 'A-'
  if (score >= 75) return 'B+'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D+'
  return 'F'
}

const getStatusString = (score: number): string => {
  return score >= 50 ? 'Passed' : 'Failed'
}

export const useApi = () => {
  // Return a mock fetch function that maps endpoint URLs to LocalStorage databases
  return async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    // Only perform local storage actions on client side. If SSR, return dummy mock objects.
    if (typeof window === 'undefined') {
      if (endpoint === '/students') return INITIAL_STUDENTS as any
      if (endpoint.includes('/analysis')) {
        return {
          gpa: 3.38,
          cgpa: 3.45,
          totalGrades: 5,
          totalPoints: 15,
          courseCount: 5,
          failedCourses: 1,
          courses: []
        } as any
      }
      return {} as T
    }

    // Initialize databases in localStorage
    if (!localStorage.getItem('student-portal-students')) {
      localStorage.setItem('student-portal-students', JSON.stringify([]))
    }
    if (!localStorage.getItem('student-portal-users')) {
      localStorage.setItem('student-portal-users', JSON.stringify([]))
    }

    const getStudentsList = (): any[] => {
      return JSON.parse(localStorage.getItem('student-portal-students') || '[]')
    }

    const saveStudentsList = (list: any[]) => {
      localStorage.setItem('student-portal-students', JSON.stringify(list))
    }

    const getUsersList = (): any[] => {
      return JSON.parse(localStorage.getItem('student-portal-users') || '[]')
    }

    const saveUsersList = (list: any[]) => {
      localStorage.setItem('student-portal-users', JSON.stringify(list))
    }

    // Mock API Endpoint Handlers
    const cleanEndpoint = endpoint.replace(/\/$/, '') // clean trailing slash

    // 1. POST /auth/signup
    if (cleanEndpoint === '/auth/signup' && options.method === 'POST') {
      const { email, username, password } = options.body
      const users = getUsersList()
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists')
      }
      users.push({ email, username, password })
      saveUsersList(users)

      // Auto-create a student profile for this new user if they don't have one
      const students = getStudentsList()
      if (!students.find(s => s.email === email)) {
        students.push({
          id: Date.now(),
          name: username.split('.').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          email,
          matricNo: 'STU/' + Math.floor(Math.random() * 90000 + 10000),
          grades: []
        })
        saveStudentsList(students)
      }

      return {
        message: 'Success',
        token: 'mock-jwt-token-for-' + email,
        student: { id: Date.now(), email, username }
      } as any
    }

    // 1.5. POST /auth/change-password
    if (cleanEndpoint === '/auth/change-password' && options.method === 'POST') {
      const token = useCookie('student-token').value
      if (!token) throw new Error('Unauthenticated')
      const email = token.replace('mock-jwt-token-for-', '')
      const { currentPassword, newPassword } = options.body
      const users = getUsersList()
      const idx = users.findIndex(u => u.email === email)
      if (idx === -1) throw new Error('User not found')
      if (users[idx].password !== currentPassword) {
        throw new Error('Current password does not match')
      }
      users[idx].password = newPassword
      saveUsersList(users)
      return { message: 'Password updated successfully' } as any
    }

    // 1.6. POST /database/seed
    if (cleanEndpoint === '/database/seed' && options.method === 'POST') {
      saveStudentsList(INITIAL_STUDENTS)
      const users = getUsersList()
      INITIAL_USERS.forEach(iu => {
        if (!users.find(u => u.email === iu.email)) {
          users.push(iu)
        }
      })
      saveUsersList(users)
      return { message: 'Sample data loaded successfully', studentsCount: INITIAL_STUDENTS.length } as any
    }

    // 1.7. POST /database/clear
    if (cleanEndpoint === '/database/clear' && options.method === 'POST') {
      saveStudentsList([])
      saveUsersList([])
      return { message: 'Database cleared successfully' } as any
    }

    // 1.8. GET /database/status
    if (cleanEndpoint === '/database/status' && (!options.method || options.method === 'GET')) {
      const students = getStudentsList()
      const users = getUsersList()
      return {
        studentsCount: students.length,
        usersCount: users.length
      } as any
    }

    // 2. POST /auth/login
    if (cleanEndpoint === '/auth/login' && options.method === 'POST') {
      const { email, password } = options.body
      const users = getUsersList()
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        throw new Error('Invalid email or password')
      }
      return {
        message: 'Success',
        token: 'mock-jwt-token-for-' + email,
        student: { id: Date.now(), email, username: user.username }
      } as any
    }

    // 3. GET /auth/me
    if (cleanEndpoint === '/auth/me') {
      const token = useCookie('student-token').value
      if (!token) throw new Error('Unauthenticated')
      const email = token.replace('mock-jwt-token-for-', '')
      const users = getUsersList()
      const user = users.find(u => u.email === email)
      if (!user) throw new Error('User not found')
      return {
        student: { id: Date.now(), email, username: user.username }
      } as any
    }

    // 4. GET /students
    if (cleanEndpoint === '/students' && (!options.method || options.method === 'GET')) {
      const students = getStudentsList()
      const tokenCookie = useCookie('student-token')
      const token = tokenCookie.value
      if (token) {
        const email = token.replace('mock-jwt-token-for-', '')
        const users = getUsersList()
        const currentUser = users.find(u => u.email === email)
        if (currentUser && !students.find(s => s.email === email)) {
          students.push({
            id: Date.now(),
            name: currentUser.username.split('.').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            email,
            matricNo: 'STU/' + Math.floor(Math.random() * 90000 + 10000),
            grades: []
          })
          saveStudentsList(students)
        }
      }
      return students as any
    }

    // 5. POST /students
    if (cleanEndpoint === '/students' && options.method === 'POST') {
      const { name, email, matricNo } = options.body
      const students = getStudentsList()
      const newStudent = {
        id: Date.now(),
        name,
        email: email || undefined,
        matricNo: matricNo || undefined,
        grades: []
      }
      students.push(newStudent)
      saveStudentsList(students)
      return newStudent as any
    }

    // 5.1 GET /database/users
    if (cleanEndpoint === '/database/users' && (!options.method || options.method === 'GET')) {
      const users = getUsersList()
      return users.map(u => ({ email: u.email, username: u.username })) as any
    }

    // 5.2 DELETE /database/users/${email}
    const deleteUserMatch = cleanEndpoint.match(/^\/database\/users\/([^\/]+)$/)
    if (deleteUserMatch && options.method === 'DELETE') {
      const email = decodeURIComponent(deleteUserMatch[1] ?? '')
      let users = getUsersList()
      users = users.filter(u => u.email !== email)
      saveUsersList(users)
      localStorage.removeItem(`student-portal-avatar-${email}`)
      return { message: 'User deleted successfully' } as any
    }

    // 5.3 DELETE /students/${studentId}
    const deleteStudentMatch = cleanEndpoint.match(/^\/students\/([^\/]+)$/)
    if (deleteStudentMatch && options.method === 'DELETE') {
      const studentId = Number(deleteStudentMatch[1] ?? '0')
      let students = getStudentsList()
      students = students.filter(s => s.id !== studentId && String(s.id) !== String(studentId))
      saveStudentsList(students)
      return { message: 'Student profile deleted successfully' } as any
    }

    // 5.4 GET /database/stats
    if (cleanEndpoint === '/database/stats' && (!options.method || options.method === 'GET')) {
      const students = getStudentsList()
      const users = getUsersList()
      let totalGrades = 0
      students.forEach(s => {
        totalGrades += (s.grades || []).length
      })
      let totalBytes = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('student-portal-')) {
          const val = localStorage.getItem(key) || ''
          totalBytes += key.length + val.length
        }
      }
      const dbSizeKb = (totalBytes / 1024).toFixed(2) + ' KB'
      return {
        studentsCount: students.length,
        usersCount: users.length,
        gradesCount: totalGrades,
        dbSizeKb
      } as any
    }

    // 6. GET /students/${studentId}
    const studentMatch = cleanEndpoint.match(/^\/students\/([^\/]+)$/)
    if (studentMatch && (!options.method || options.method === 'GET')) {
      const studentId = Number(studentMatch[1])
      const students = getStudentsList()
      const student = students.find(s => s.id === studentId || String(s.id) === String(studentId))
      if (!student) throw new Error('Student not found')

      // Calculate recommendations
      const failed = (student.grades || []).filter((g: any) => g.score < 50)
      const recs = [
        'Organize weekly notes reviews to strengthen subject definitions.',
        'Attend student study peer consultations for hard modules.'
      ]
      failed.forEach((g: any) => {
        recs.push(`Schedule target revision modules for failed subject: ${g.courseCode}.`)
      })

      return {
        student,
        analysis: {
          recommendations: recs
        }
      } as any
    }

    // 7. POST /students/${studentId}/grades
    const gradeMatch = cleanEndpoint.match(/^\/students\/([^\/]+)\/grades$/)
    if (gradeMatch && options.method === 'POST') {
      const studentId = Number(gradeMatch[1])
      const { courseCode, units, score, semester } = options.body
      const students = getStudentsList()
      const idx = students.findIndex(s => s.id === studentId || String(s.id) === String(studentId))
      if (idx === -1) throw new Error('Student not found')

      if (!students[idx].grades) students[idx].grades = []
      
      // Look up subject title mapping
      let subject = 'Academic Course'
      if (courseCode.startsWith('CSC')) subject = 'Computer Science Module'
      else if (courseCode.startsWith('MTH')) subject = 'Mathematics Module'
      else if (courseCode.startsWith('PHY')) subject = 'Engineering Physics'
      else if (courseCode.startsWith('ENG')) subject = 'Academic Writing'

      students[idx].grades.push({
        courseCode,
        subject,
        score,
        semester,
        units
      })
      saveStudentsList(students)
      return { message: 'Grade submitted successfully' } as any
    }

    // 8. GET /students/${studentId}/analysis
    const analysisMatch = cleanEndpoint.match(/^\/students\/([^\/]+)\/analysis$/)
    if (analysisMatch && (!options.method || options.method === 'GET')) {
      const studentId = Number(analysisMatch[1])
      const students = getStudentsList()
      const student = students.find(s => s.id === studentId || String(s.id) === String(studentId))
      if (!student) throw new Error('Student not found')

      const grades = student.grades || []
      let totalPoints = 0
      let totalUnits = 0
      let failedCount = 0

      const mappedCourses = grades.map((g: any) => {
        const { grade, status } = calculateGradeAndStatus(g.score)
        totalPoints += getGradePoints(g.score) * g.units
        totalUnits += g.units
        if (status === 'Failed') failedCount++

        return {
          code: g.courseCode,
          title: g.subject || 'Course Module',
          semester: g.semester || 'Fall 2025',
          credits: g.units,
          grade: getGradeSymbol(g.score),
          status
        }
      })

      const gpa = totalUnits > 0 ? (totalPoints / totalUnits) : 0
      
      // Recommendations list
      const recs = [
        { title: 'Time scheduling blocks', description: 'Dedicate focused, uninterrupted morning blocks for weekly course reviews.' },
        { title: 'Revisit weak syllabus items', description: 'Revisit module chapters scoring below a B grade to keep transcript index balanced.' }
      ]
      if (gpa < 3.0) {
        recs.push({ title: 'Accelerated revision hours', description: 'Increase revision hours for core subjects by 3 hours per week.' })
      }
      if (failedCount > 0) {
        recs.push({ title: 'Retake preparations', description: 'Register early for retake programs next semester to minimize course load delays.' })
      }

      return {
        gpa,
        cgpa: gpa || 3.38,
        totalGrades: grades.length,
        totalPoints,
        courseCount: grades.length,
        failedCourses: failedCount,
        recommendations: recs,
        courses: mappedCourses
      } as any
    }

    // 9. GET /students/${studentId}/recommendations
    const recsMatch = cleanEndpoint.match(/^\/students\/([^\/]+)\/recommendations$/)
    if (recsMatch && (!options.method || options.method === 'GET')) {
      const studentId = Number(recsMatch[1])
      const students = getStudentsList()
      const student = students.find(s => s.id === studentId || String(s.id) === String(studentId))
      if (!student) throw new Error('Student not found')

      const failed = (student.grades || []).filter((g: any) => g.score < 50)
      const recList = [
        'Incorporate regular practice tests in study routines.',
        'Use collaborative study blocks to review challenging proofs.'
      ]
      failed.forEach((g: any) => {
        recList.push(`Dedicate special revision modules for failed subject: ${g.courseCode}.`)
      })

      return {
        recommendations: recList
      } as any
    }

    throw new Error('Route not found')
  }
}

// Internal helper for grade status
const calculateGradeAndStatus = (score: number) => {
  const status = score >= 50 ? 'Passed' : 'Failed'
  const grade = getGradeSymbol(score)
  return { grade, status }
}
