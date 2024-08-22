package competiton.flora.flora.repository;

import competiton.flora.flora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);

    User findByEmailIgnoreCase(String email);

     boolean existsByEmail(String email);
}
