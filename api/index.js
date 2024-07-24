const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// acquiring databases
const UserModel = require('./models/UserModel');
const PersonaInfoModel = require('./models/PersonaInfoModel');
const AcademicModel = require('./models/AcademicsModel');
const PositionModel = require('./models/PositionModel');
const PlatformModel = require('./models/PlatformModel');
const ProjectModel = require('./models/ProjectModel');

const bcrypt = require('bcrypt');
const bcryptSalt = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const jwtSalt = 'justarandomstringcangohere'

const cookieParser = require('cookie-parser');


const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition, TableRow, TableCell, Table, WidthType } = require("docx");


app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
}))

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json('test okay');
})

app.post('/api/register', async (req, res) => {
    // mongoose.connect(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // create a new user
        const userData = await UserModel.create({
            name, email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })

        res.json(userData);
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

app.post('/api/login', async (req, res) => {
    // mongoose.connect(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    const { email, password } = req.body;
    try {
        const userData = await UserModel.findOne({ email });
        // if mail not exists it will be null or undefined
        if (userData) {
            const passCheck = bcrypt.compareSync(password, userData.password);
            if (passCheck) {
                // payload - information you want to include in the token
                const payload = { email: userData.email, id: userData._id };
                jwt.sign(payload, jwtSalt, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userData);
                });
            }
            else {
                res.status(422).json({ message: 'Wrong Password' });
            }
        }
        else {
            res.status(422).json({ message: 'No Such User Found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Wrong Email or Password' });
    }
})

app.get('/api/profile', (req, res) => {
    // mongoose.connect(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSalt, {}, async (err, userData) => {
            if (err) throw err;

            // fetch user from database from the id as we have only two
            // thing in cookie data 1. id and 2. email

            // -------- Two method to fetch -------
            // --1
            // const { name, email, _id } = await UserModel.findById(userData.id);
            // --2
            const { name, email, _id } = await UserModel.findOne({ _id: userData.id });

            res.json({ name, email, _id });
        })
    }
    else {
        res.json(null);
    }
})

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').json(true);
})

app.post('/api/resume/personinfo/:id', async (req, res) => {
    // mongoose.connect(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    const {
        firstName,
        lastName,
        dob,
        gender,
        branch,
        enrollmentNo,
        year,
        email,
        phone,
    } = req.body;

    // check if user is verified
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSalt, {}, async (err, userData) => {
            if (err) throw err;

            const personInfoDoc = await PersonaInfoModel.findOne({ owner: userData.id });
            // find if it is already exist update
            if (personInfoDoc) {
                personInfoDoc.set({
                    firstName, lastName, dob, gender, branch, enrollmentNo,
                    year, email, phone
                });

                await personInfoDoc.save();
                res.json(personInfoDoc);
            }
            // if not create new data
            else {
                try {
                    // create a new personal info for user
                    const personInfoData = await PersonInfoModel.create({
                        owner: userData.id,
                        firstName, lastName,
                        dob,
                        gender,
                        branch, enrollmentNo, year,
                        email, phone,
                    })

                    res.json(personInfoData);
                }
                catch (error) {
                    console.error('Error during Saving', error);
                    res.status(500).json({ message: 'Server error during saving' });
                }
            }
        })
    }
    else {
        res.json(null);
    }

})
app.get('/api/resume/personinfo/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    try {
        const personInfo = await PersonaInfoModel.findOne({ owner: id });
        if (!personInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(personInfo);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/resume/academics/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { tenthDetails, twelfthDetails, graduationDetails, scholasticAchievement } = req.body;

    // Check if user is verified
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSalt, {}, async (err, userData) => {
            if (err) throw err;

            try {
                // Find if it already exists
                const academicsDoc = await AcademicModel.findOne({ owner: userData.id });

                if (academicsDoc) {
                    // Update the existing document
                    academicsDoc.set({
                        tenth: tenthDetails,
                        twelfth: twelfthDetails,
                        graduation: graduationDetails,
                        scholasticAchievement // Add the new field here
                    });

                    await academicsDoc.save();
                    res.json(academicsDoc);
                } else {
                    // Create a new document
                    const academicsData = await AcademicModel.create({
                        owner: userData.id,
                        tenth: tenthDetails,
                        twelfth: twelfthDetails,
                        graduation: graduationDetails,
                        scholasticAchievement // Add the new field here
                    });

                    res.json(academicsData);
                }
            } catch (error) {
                console.error('Error during Saving', error);
                res.status(500).json({ message: 'Server error during saving' });
            }
        });
    } else {
        res.json(null);
    }
});
app.get('/api/resume/academics/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    try {
        const academicInfo = await AcademicModel.findOne({ owner: id });
        if (!academicInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(academicInfo);
    } catch (error) {
        console.error('Error fetching academic data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/resume/positions/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { positions, activities } = req.body;

    // Check if user is verified
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSalt, {}, async (err, userData) => {
            if (err) throw err;

            try {
                // Find if it already exists
                const positionDoc = await PositionModel.findOne({ owner: userData.id });

                if (positionDoc) {
                    // Update the existing document
                    positionDoc.set({
                        positions,
                        activities
                    });

                    await positionDoc.save();
                    res.json(positionDoc);
                } else {
                    // Create a new document
                    const positionData = await PositionModel.create({
                        owner: userData.id,
                        positions,
                        activities
                    });

                    res.json(positionData);
                }
            } catch (error) {
                console.error('Error during saving', error);
                res.status(500).json({ message: 'Server error during saving' });
            }
        });
    } else {
        res.json(null);
    }
});
app.get('/api/resume/positions/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    try {
        const positionInfo = await PositionModel.findOne({ owner: id });
        if (!positionInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(positionInfo);
    } catch (error) {
        console.error('Error fetching position data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/resume/platforms/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { operatingSystems, programmingSkills, webDesigningSkills, softwareSkills, courses } = req.body;

    // Check if user is verified
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSalt, {}, async (err, userData) => {
            if (err) throw err;

            try {
                // Find if it already exists
                const platformDoc = await PlatformModel.findOne({ owner: userData.id });

                if (platformDoc) {
                    // Update the existing document
                    platformDoc.set({
                        operatingSystems,
                        programmingSkills,
                        webDesigningSkills,
                        softwareSkills,
                        courses
                    });

                    await platformDoc.save();
                    res.json(platformDoc);
                } else {
                    // Create a new document
                    const platformData = await PlatformModel.create({
                        owner: userData.id,
                        operatingSystems,
                        programmingSkills,
                        webDesigningSkills,
                        softwareSkills,
                        courses
                    });

                    res.json(platformData);
                }
            } catch (error) {
                console.error('Error during saving', error);
                res.status(500).json({ message: 'Server error during saving' });
            }
        });
    } else {
        res.json(null);
    }
});
app.get('/api/resume/platforms/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    try {
        const platformInfo = await PlatformModel.findOne({ owner: id });
        if (!platformInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(platformInfo);
    } catch (error) {
        console.error('Error fetching platform data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/resume/projects/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    const { projects, workExperience } = req.body;

    try {
        const project = await ProjectModel.findOneAndUpdate(
            { owner: id },
            { projects, workExperience },
            { new: true, upsert: true } // Create new if not exists
        );

        res.json(project);
    } catch (error) {
        console.error('Error saving project data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/resume/projects/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;

    try {
        const project = await ProjectModel.findOne({ owner: id });
        if (!project) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// MAIN DOC CREATOR CLASS
class DocumentCreator {
    create([positions, academics, platforms, projects, personaInfo]) {
        const document = new Document({
            sections: [{
                children: [
                    ...this.createppperson(personaInfo),
                    new Paragraph({ text: ` ` }),
                    this.createHeading(""),
                    new Paragraph({ text: ` ` }),
                    ...this.createEducationSections(academics),
                    new Paragraph({ text: ` ` }),
                    this.createHeading("Scholastic Achievements"),
                    new Paragraph({ text: ` ` }),
                    ...this.createScholasticAchievementsSections(academics),
                    new Paragraph({ text: ` ` }),
                    ...this.workexpcontent(projects),
                    this.createHeading("Projects"),
                    new Paragraph({ text: ` ` }),
                    ...this.createProjectsSections(projects),
                    new Paragraph({ text: ` ` }),
                    this.createHeading("Platforms, Languages, Technologies & Tools Worked"),
                    new Paragraph({ text: ` ` }),
                    ...this.createSkillsSections(platforms),
                    new Paragraph({ text: ` ` }),
                    this.createHeading("Courses Undertaken"),
                    new Paragraph({ text: ` ` }),
                    ...this.createCoursesSections(platforms),
                    new Paragraph({ text: ` ` }),
                    this.createHeading("Positions of Responsibility"),
                    new Paragraph({ text: ` ` }),
                    ...this.createExperienceSections(positions),
                    new Paragraph({ text: ` ` }),
                    this.createHeading("Extracurricular Activities"),
                    new Paragraph({ text: ` ` }),
                    ...this.createActivitiesSections(positions),
                ],
            }],
        });

        return document;
    }

    workexpcontent(projects) {
        const content = [];

        if (projects.workExperience && projects.workExperience.length > 0) {
            content.push(
                this.createHeading("Work Experience"),
                new Paragraph({ text: ` ` }),
                ...this.createWorkExperienceSections(projects.workExperience),
                new Paragraph({ text: ` ` }),
            );
        }

        return content;
    }

    createWorkExperienceSections(workExperience) {
        return workExperience.map(experience => [
            this.createInstitutionHeader(experience.jobTitle, experience.duration),
            this.createRoleText(experience.company),
            ...this.splitParagraphIntoBullets(experience.description).map(this.createBullet)
        ]).flat();
    }


    createppperson(personaInfo) {
        // Define the font style with size 8
        const boldGeorgiaTextRun = (text) => new TextRun({
            text,
            bold: true,
            font: 'Georgia',
            size: 8 * 2, // Font size in half-points (8pt * 2 = 16 half-points)
        });

        // Create the table row with two columns
        const tableRow = new TableRow({
            children: [
                // First Column
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [boldGeorgiaTextRun('[logo]                                      ' + personaInfo.firstName + ' ' + personaInfo.lastName)],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('                                                  ' + 'UG ' + personaInfo.year)],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('                                                  ' + 'SGSITS, Indore')],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('                                                  ' + 'Date Of Birth: ' + personaInfo.dob)],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('                                                  ' + 'Email ID: ' + personaInfo.email)],
                        }),
                    ],
                    borders: {
                        top: { size: 0, color: "FFFFFF" },
                        bottom: { size: 0, color: "FFFFFF" },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                    width: { size: 60, type: WidthType.PERCENTAGE }, // 60% width of the table
                }),
                // Second Column
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [boldGeorgiaTextRun('Enrollment No.: ' + personaInfo.enrollmentNo)],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('Department: ' + personaInfo.branch)],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('Gender: ' + personaInfo.gender)],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('Specialization: None')],
                        }),
                        new Paragraph({
                            children: [boldGeorgiaTextRun('Mobile #: ' + personaInfo.phone)],
                        }),
                    ],
                    borders: {
                        top: { size: 0, color: "FFFFFF" },
                        bottom: { size: 0, color: "FFFFFF" },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                    width: { size: 40, type: WidthType.PERCENTAGE }, // 40% width of the table
                }),
            ],
        });

        // Create the table with one row
        const table = new Table({
            rows: [tableRow],
            width: {
                size: 100, // 100% width of the page
                type: WidthType.PERCENTAGE,
            },
            borders: {
                top: { size: 0, color: "FFFFFF" },
                bottom: { size: 0, color: "FFFFFF" },
                left: { size: 0, color: "FFFFFF" },
                right: { size: 0, color: "FFFFFF" },
            },
        });

        return [table];
    }


    createHeading(text) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: text,
                    font: 'Georgia',
                    size: 30,
                    bold: true,
                }),
            ],
            heading: HeadingLevel.TITLE,
            thematicBreak: true,
        });
    }

    createSubHeading(text) {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_4,
        });
    }

    createEducationSections(academics) {
        const georgiaTextRun = (text) => new TextRun({
            text,
            font: 'Georgia',
            size: 8 * 2, // Font size in half-points (8pt * 2 = 16 half-points)
        });
        const georgiaTextRunBold = (text) => new TextRun({
            text,
            bold: true,
            font: 'Georgia',
            size: 8 * 2, // Font size in half-points (8pt * 2 = 16 half-points)
        });

        // Create table rows
        const tableRows = [];

        // Add headings
        tableRows.push(new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [georgiaTextRunBold('Degree / Certificate')] })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { size: 1, color: '000000' },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [georgiaTextRunBold('University /      Board')] })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { size: 1, color: '000000' },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [georgiaTextRunBold('Institute / School')] })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { size: 1, color: '000000' },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [georgiaTextRunBold('Year of Passing')] })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { size: 1, color: '000000' },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [georgiaTextRunBold('CGPA / Percentage')] })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { size: 1, color: '000000' },
                        left: { size: 0, color: "FFFFFF" },
                        right: { size: 0, color: "FFFFFF" },
                    },
                }),
            ],
        }));

        // Add graduation details
        if (academics.graduation) {
            tableRows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun('Graduation')] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.graduation.university)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.graduation.college)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.graduation.passOutYear)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.graduation.percentage)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                ],
            }));
        }

        // Add twelfth details
        if (academics.twelfth) {
            const chk = academics.twelfth.isDiploma ? 'Diploma' : "12th";
            tableRows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(chk)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.twelfth.board)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.twelfth.school)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.twelfth.passOutYear)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.twelfth.percentage + '%')] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                ],
            }));
        }

        // Add tenth details
        if (academics.tenth) {
            tableRows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun('10th')] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                            bottom: { size: 1, color: '000000' },
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.tenth.board)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                            bottom: { size: 0, color: "FFFFFF" }, // No bottom border for middle cells
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.tenth.school)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                            bottom: { size: 0, color: "FFFFFF" }, // No bottom border for middle cells
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.tenth.passOutYear)] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                            bottom: { size: 0, color: "FFFFFF" }, // No bottom border for middle cells
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [georgiaTextRun(academics.tenth.percentage + '%')] })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { size: 1, color: '000000' },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                            bottom: { size: 0, color: "FFFFFF" }, // No bottom border for middle cells
                        },
                    }),
                ],
            }));
        }


        // Create the table
        const table = new Table({
            rows: tableRows,
            width: {
                size: 95, // 80% width of the page
                type: WidthType.PERCENTAGE,
            },
            borders: {
                top: { size: 1, color: "000000" },
                bottom: { size: 1, color: "000000" },
                left: { size: 0, color: "FFFFFF" },
                right: { size: 0, color: "FFFFFF" },
            },
            alignment: AlignmentType.CENTER, // Align table to center
        });


        return [table];
    }

    createProjectsSections(projects) {
        return projects.projects.map(project => [
            this.createInstitutionHeader(project.title, project.duration),
            ...this.splitParagraphIntoBullets(project.description).map(this.createBullet),
            this.createBullet("Teck Stack : " + project.technologies),
            new Paragraph({ text: ` ` }),
        ]).flat();
    }

    createSkillsSections(platforms) {
        const skills = [
            `Operating Systems: ${platforms.operatingSystems.join(", ")}`,
            `Programming Skills: ${platforms.programmingSkills.join(", ")}`,
            `Web Designing: ${platforms.webDesigningSkills.join(", ")}`,
            `Software Skills: ${platforms.softwareSkills.join(", ")}`,
        ];
        return skills.map(skill => this.createBullet(skill));
    }

    createCoursesSections(platforms) {
        const tableRows = [];

        const maxRows = Math.max(platforms.courses.core.length, platforms.courses.depth.length);


        for (let i = 0; i < maxRows; i++) {
            tableRows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: platforms.courses.core[i] || "",
                                        font: 'Georgia',
                                        size: 8 * 2
                                    }),
                                ],
                                bullet: {
                                    level: 0,
                                }
                            }),
                        ],
                        borders: {
                            top: { size: 0, color: "FFFFFF" },
                            bottom: { size: 0, color: "FFFFFF" },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: platforms.courses.depth[i] || "",
                                        font: 'Georgia',
                                        size: 8 * 2
                                    }),
                                ],
                                bullet: {
                                    level: 0,
                                }
                            }),
                        ],
                        borders: {
                            top: { size: 0, color: "FFFFFF" },
                            bottom: { size: 0, color: "FFFFFF" },
                            left: { size: 0, color: "FFFFFF" },
                            right: { size: 0, color: "FFFFFF" },
                        },
                    }),
                ],
            }));
        }

        const table = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                this.createInstitutionHeader("Core Courses", ''),
                            ],
                            borders: {
                                top: { size: 0, color: "FFFFFF" },
                                bottom: { size: 0, color: "FFFFFF" },
                                left: { size: 0, color: "FFFFFF" },
                                right: { size: 0, color: "FFFFFF" },
                            },
                        }),
                        new TableCell({
                            children: [
                                this.createInstitutionHeader("Depth Courses", ''),
                            ],
                            borders: {
                                top: { size: 0, color: "FFFFFF" },
                                bottom: { size: 0, color: "FFFFFF" },
                                left: { size: 0, color: "FFFFFF" },
                                right: { size: 0, color: "FFFFFF" },
                            },
                        }),
                    ],
                }),
                ...tableRows,
            ],
            borders: {
                top: { size: 0, color: "FFFFFF" },
                bottom: { size: 0, color: "FFFFFF" },
                left: { size: 0, color: "FFFFFF" },
                right: { size: 0, color: "FFFFFF" },
            },
        });

        return [table];
    }


    createExperienceSections(positions) {
        return positions.positions.map((position) => [
            this.createInstitutionHeader(position.position, position.duration),
            ...position.description.split('/').map(desc => this.createBullet(desc.trim())),
            new Paragraph({ text: ` ` }),
        ]).flat();
    }

    createActivitiesSections(positions) {
        return positions.activities.map(activity => [
            this.createInstitutionHeader(activity.event, activity.duration),
            ...this.splitParagraphIntoBullets(activity.description).map(this.createBullet),
            new Paragraph({ text: ` ` }),
        ]).flat();
    }

    createScholasticAchievementsSections(academics) {
        return this.splitParagraphIntoBullets(academics.scholasticAchievement).map(this.createBullet);
    }

    createInstitutionHeader(institutionName, dateText) {
        return new Paragraph({
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: TabStopPosition.MAX,
                },
            ],
            children: [
                new TextRun({
                    text: institutionName,
                    font: 'Georgia',
                    bold: true,
                }),
                new TextRun({
                    text: `\t${dateText}`,
                    font: 'Georgia',
                    bold: true,
                }),
            ],
        });
    }

    createRoleText(roleText) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: roleText,
                    font: 'Georgia',
                    italics: true,
                }),
            ],
        });
    }

    createBullet(text) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: text,
                    font: 'Georgia',
                    size: 8 * 2, // Font size in half-points (8pt * 2 = 16 half-points)
                })
            ],
            bullet: {
                level: 0,
            },
        });
    }

    createSkillList(skills) {
        return new Paragraph({
            children: [new TextRun(skills.join(", ") + ".")],
        });
    }

    splitParagraphIntoBullets(text) {
        return text.split("/");
    }
}

app.get('/api/download-resume/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userId = req.params.id;

    try {
        const user = await UserModel.findById(userId);
        const personaInfo = await PersonaInfoModel.findOne({ owner: userId });
        const academics = await AcademicModel.findOne({ owner: userId });
        const platforms = await PlatformModel.findOne({ owner: userId });
        const positions = await PositionModel.findOne({ owner: userId }).populate('owner');
        const projects = await ProjectModel.findOne({ owner: userId });

        if (!user || !personaInfo || !academics || !platforms || !positions || !projects) {
            return res.status(404).json({ message: 'User or related data not found' });
        }

        const documentCreator = new DocumentCreator();
        const doc = documentCreator.create([positions, academics, platforms, projects, personaInfo]);

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', `attachment; filename=CV02Pages_${personaInfo.enrollmentNo}_BT_Branch_${personaInfo.firstName}_${personaInfo.lastName}.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const PORTT = process.env.PORT || 4000;
app.listen(PORTT);