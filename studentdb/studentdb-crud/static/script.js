const host = "https://redesigned-adventure-5wx6x97xr5p3vj5g-8000.app.github.dev/"
function getdata() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  fetch(host+"api/student_list", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      if (data.length) {
        data.forEach((student) => {
          const sid = student.student_id;
          const sname = student.student_name;
          const sdept = student.student_department;
          const scgpa = student.student_cgpa;
          row = `<tr id=${sid}>
                      <td><input type = "number" class="sid" value=${sid} disabled></td>
                      <td><input type = "text" class="sname" value="${sname}" disabled></td>
                      <td><input type = "text" class="sdept" value="${sdept}" disabled></td>
                      <td><input type = "number" class="scgpa" value=${scgpa} disabled></td>
                      <td><button class = "del" onclick="return sdelete(${sid}, '${sname}');">Delete</button></td>
                      <td><button class = "update" onclick="return filldata(${sid});">Edit</button></td>
                      <td><button class = "done" onclick="return updates(${sid});" disabled>Done</button></td>
                  <tr>`;
          tbody.insertAdjacentHTML("beforeend", row);
        });
      } else {
        row = `<tr><td colspan="7"><h3 style = "text-align: center">No rows are present!</h3></td></tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
      }
    })
    .catch((err) => console.log(err));
}

function check(sname, sdept, scgpa) {
  if (sname && sdept && scgpa) {
    if (isNaN(sname) && isNaN(sdept)) {
      if (Number(scgpa) >= 0.0 && Number(scgpa) <= 10.0) {
        return true;
      } else {
        alert("CGPA ranges between 0.00 and 10.00\n");
        return false;
      }
    } else {
      if (!isNaN(sname)) {
        alert("Name should be in alphabet!\n");
        return false;
      }
      if (!isNaN(sdept)) {
        alert("Department should be in alphabet!\n");
        return false;
      }
    }
  } else {
    alert("All the fields are mandatory!");
    return false;
  }
}

const addstudent = document.getElementById("submit");
addstudent.addEventListener("click", (event) => {
  event.preventDefault();
  const sname = document.getElementById("name").value;
  const sdept = document.getElementById("dept").value;
  const scgpa = document.getElementById("cgpa").value;
  if (check(sname, sdept, scgpa)) {
    const form = document.getElementById("form");
    const data = new FormData(form);
    fetch(host+"api/add_student", {
      method: "POST",
      body: data,
    })
      .then(() => {
        alert("Student Registered successfully!");
        form.reset();
        getdata();
      })
      .catch((e) => alert("Student not registered"));
  }
});

const remove = document.getElementById("remove");
remove.addEventListener("click", (event) => {
  event.preventDefault();
  if (confirm("Are you sure to delete all the records in the table?")) {
    fetch(host+"api/drop_students", { method: "GET" })
      .then(() => {
        alert("All the students are removed!");
        getdata();
      })
      .catch((e) => alert("Cannot able to remove the students"));
  }
});

const sdelete = (sid, sname) => {
  if (
    confirm(
      "Do you want to delete the student -> " + sname + " with id=" + sid + "?"
    )
  ) {
    const api = host+"api/delete_student/" + sid;
    fetch(api, { method: "POST" })
      .then(() => {
        getdata();
      })
      .catch((e) => alert("Cannot delete the student"));
  } else return false;
};

const filldata = (sid) => {
  document.getElementById(sid).children[1].children[0].disabled = false;
  document.getElementById(sid).children[2].children[0].disabled = false;
  document.getElementById(sid).children[3].children[0].disabled = false;
  document.getElementById(sid).children[6].children[0].disabled = false;
  return true;
};

const updates = (sid) => {
  const sname = document.getElementById(sid).children[1].children[0].value;
  const sdept = document.getElementById(sid).children[2].children[0].value;
  const scgpa = document.getElementById(sid).children[3].children[0].value;
  if (check(sname, sdept, scgpa)) {
    const data = new FormData();
    data.append("sid", sid);
    data.append("name", sname);
    data.append("dept", sdept);
    data.append("cgpa", scgpa);
    fetch(host+"api/update_student", {
      method: "POST",
      body: data,
    })
      .then(() => {
        alert("Student Updated successfully!");
        getdata();
      })
      .catch((e) => alert("Student not registered"));
  }
};
